pipeline {
    agent any

    environment {
        PROJECT_ID = "gcp-devops-470417"
        ARTIFACT_REGION = "asia-south1"      // Artifact Registry region
        RUN_REGION = "europe-west1"          // Cloud Run region
        REPO = "docker-app"
        IMAGE = "hello-node"
        GOOGLE_APPLICATION_CREDENTIALS = "/var/lib/jenkins/gcp/key.json"
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
                sh 'gcloud config set project $PROJECT_ID'
            }
        }

        stage('Configure Docker for Artifact Registry') {
            steps {
                sh 'gcloud auth configure-docker $ARTIFACT_REGION-docker.pkg.dev -q'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $ARTIFACT_REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$BUILD_NUMBER .'
            }
        }

        stage('Push Image to Artifact Registry') {
            steps {
                sh 'docker push $ARTIFACT_REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$BUILD_NUMBER'
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                sh '''
                    gcloud run deploy $IMAGE \
                        --image=$ARTIFACT_REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$BUILD_NUMBER \
                        --platform=managed \
                        --region=$RUN_REGION \
                        --allow-unauthenticated
                '''
            }
        }
    }
}
