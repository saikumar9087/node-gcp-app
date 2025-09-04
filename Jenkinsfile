pipeline {
    agent any

    environment {
        PROJECT_ID   = "gcp-devops-470417"          // Your GCP project ID
        REGION       = "asia-south1"           // Change if needed
        REPO         = "docker-app"        // Artifact Registry repo
        IMAGE        = "hello-node"            // Image name
        SERVICE_NAME = "node-gcp-app"         // Cloud Run service name
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/saikumar9087/node-gcp-app.git'
            }
        }

        stage('Authenticate to GCP') {
    steps {
        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
        sh 'gcloud config set project gcp-devops-470417'
    }
}


        stage('Configure Docker for Artifact Registry') {
            steps {
                sh '''
                    gcloud auth configure-docker ${REGION}-docker.pkg.dev -q
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE}:$BUILD_NUMBER .
                '''
            }
        }

        stage('Push Image to Artifact Registry') {
            steps {
                sh '''
                    docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE}:$BUILD_NUMBER
                '''
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                sh '''
                    gcloud run deploy $SERVICE_NAME \
                      --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE}:$BUILD_NUMBER \
                      --platform=managed \
                      --region=$REGION \
                      --allow-unauthenticated
                '''
            }
        }
    }
}
