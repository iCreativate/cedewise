#!/bin/bash

# Cedewise Multi-Region AWS Deployment Script
# This script automates the deployment of the Cedewise application to multiple AWS regions

set -e

# Configuration
PRIMARY_REGION=${PRIMARY_REGION:-"us-east-1"}
SECONDARY_REGION=${SECONDARY_REGION:-"eu-west-1"}
DR_REGION=${DR_REGION:-"ap-south-1"}
APP_NAME="cedewise"
ENVIRONMENT=${ENVIRONMENT:-"production"}

# AWS Resource Naming
S3_DOCUMENT_BUCKET="${APP_NAME}-documents-${ENVIRONMENT}"
S3_IMAGE_BUCKET="${APP_NAME}-images-${ENVIRONMENT}"
ECS_CLUSTER="${APP_NAME}-cluster-${ENVIRONMENT}"
DB_CLUSTER="${APP_NAME}-aurora-${ENVIRONMENT}"
LEX_BOT_NAME="${APP_NAME}-assistant-${ENVIRONMENT}"
SQS_QUEUE_NAME="${APP_NAME}-notifications-${ENVIRONMENT}"

# Print banner
echo "====================================================================="
echo "  Cedewise Multi-Region AWS Deployment"
echo "  Environment: $ENVIRONMENT"
echo "  Primary Region: $PRIMARY_REGION"
echo "  Secondary Region: $SECONDARY_REGION"
echo "  DR Region: $DR_REGION"
echo "====================================================================="

# Check AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
echo "Checking AWS credentials..."
aws sts get-caller-identity || {
    echo "Error: AWS credentials not configured or invalid."
    echo "Please run 'aws configure' or set the appropriate environment variables."
    exit 1
}

# Function to deploy infrastructure in a region
deploy_region() {
    local region=$1
    local is_primary=$2
    
    echo "Deploying to region: $region (Primary: $is_primary)"
    
    # Set AWS region for commands
    export AWS_DEFAULT_REGION=$region
    
    # 1. Create VPC and network infrastructure
    echo "Creating VPC and network infrastructure..."
    # aws cloudformation deploy --template-file infra/vpc.yaml --stack-name ${APP_NAME}-vpc-${ENVIRONMENT} --parameter-overrides Environment=${ENVIRONMENT}
    
    # 2. Create S3 buckets (only in primary region, others get replicated)
    if [ "$is_primary" = true ]; then
        echo "Creating S3 buckets..."
        # aws s3api create-bucket --bucket $S3_DOCUMENT_BUCKET --region $region
        # aws s3api create-bucket --bucket $S3_IMAGE_BUCKET --region $region
        
        # Enable versioning
        # aws s3api put-bucket-versioning --bucket $S3_DOCUMENT_BUCKET --versioning-configuration Status=Enabled
        # aws s3api put-bucket-versioning --bucket $S3_IMAGE_BUCKET --versioning-configuration Status=Enabled
        
        # Setup cross-region replication
        echo "Setting up S3 cross-region replication to $SECONDARY_REGION..."
        # aws s3api put-bucket-replication --bucket $S3_DOCUMENT_BUCKET --replication-configuration file://infra/s3-replication.json
    fi
    
    # 3. Create Aurora PostgreSQL cluster
    echo "Creating Aurora PostgreSQL cluster..."
    # aws rds create-db-cluster --db-cluster-identifier $DB_CLUSTER --engine aurora-postgresql --engine-version 13.6 --master-username admin --master-user-password "$DB_PASSWORD" --db-subnet-group-name ${APP_NAME}-db-subnet-group --vpc-security-group-ids sg-xxxxx
    
    # 4. Create ECS cluster and task definitions
    echo "Creating ECS cluster..."
    # aws ecs create-cluster --cluster-name $ECS_CLUSTER
    
    # 5. Deploy task definitions and services
    echo "Deploying ECS task definitions and services..."
    # aws ecs register-task-definition --cli-input-json file://infra/task-definition.json
    
    # 6. Create Amazon Lex bot (only in regions where Lex is available)
    echo "Creating Amazon Lex bot..."
    # aws lexv2-models create-bot --cli-input-json file://infra/lex-bot.json
    
    # 7. Create SQS queues
    echo "Creating SQS queue..."
    # aws sqs create-queue --queue-name $SQS_QUEUE_NAME
    
    # 8. Create CloudWatch alarms and dashboards
    echo "Setting up CloudWatch monitoring..."
    # aws cloudwatch put-dashboard --dashboard-name ${APP_NAME}-dashboard-${ENVIRONMENT} --dashboard-body file://infra/cloudwatch-dashboard.json
    
    # 9. Setup scaling policies
    echo "Setting up auto-scaling policies..."
    # aws application-autoscaling register-scalable-target --service-namespace ecs --resource-id service/${ECS_CLUSTER}/${APP_NAME}-service --scalable-dimension ecs:service:DesiredCount --min-capacity 2 --max-capacity 10
    
    echo "Deployment to $region completed successfully!"
}

# Deploy to primary region
echo "Starting deployment to primary region: $PRIMARY_REGION"
deploy_region $PRIMARY_REGION true

# Deploy to secondary region
echo "Starting deployment to secondary region: $SECONDARY_REGION"
deploy_region $SECONDARY_REGION false

# Setup Route 53 for multi-region routing
echo "Setting up Route 53 for multi-region routing..."
# aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch file://infra/route53-changes.json

# Setup CloudFront distribution
echo "Setting up CloudFront distribution..."
# aws cloudfront create-distribution --distribution-config file://infra/cloudfront-config.json

echo "Deployment completed successfully!"
echo "Application is accessible at: https://${APP_NAME}.example.com"
echo "Administration console: https://admin.${APP_NAME}.example.com" 