# AWS Region that the ECS Cluster is in
ECS_REGION='us-west-2'
# Name of the ECS Cluster
ECS_CLUSTER_NAME='hnhiringCluster'
# Name of the service on the ECS Cluster
ECS_SERVICE_NAME='hnhiring-cluster'
# Name of the task definition used by the service
ECS_TASK_DEFINITION_NAME='first-run-task-definition:4'
# Name of the ECR
ECR_NAME='hnhiring'
# URI of the ECR
ECR_URI='412573645525.dkr.ecr.us-west-2.amazonaws.com/hnhiring'
# Current timestamp, to use as a version tag.
VERSION=$(date +%s)
# Minimum targe AWS CLI version
AWSCLI_VER_TAR=1.16.81


# Build the Docker image from the Docker file.
docker build --pull -t "${ECR_NAME}:latest" -f ./docker/Dockerfile .

# Tag the new Docker image to the remote repo, using the VERSION identifier
docker tag "${ECR_NAME}:latest" "${ECR_URI}/${ECR_NAME}:${ENVIRONMENT}-${VERSION}"

# Tag the new Docker image to the remote repo, using the "latest-ENVIRONMENT" identifier 
docker tag "${ECR_NAME}:latest" "${ECR_URI}/${ECR_NAME}:latest-${ENVIRONMENT}"

# Login to AWS ECR
$(aws ecr get-login --region "${ECS_REGION}")

# Push to the remote ECR repo (VERSION identifier)
docker push "${ECR_URI}/${ECR_NAME}:${ENVIRONMENT}-${VERSION}"

# Push to the remote ECR repo (latest-ENVIRONMENT identifier)
docker push "${ECR_URI}/${ECR_NAME}:latest-${ENVIRONMENT}"