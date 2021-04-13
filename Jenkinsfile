pipeline {
  agent any

  environment {
    /*---AWS ECR Credentials---*/
    REGISTRY = '003235076673.dkr.ecr.eu-central-1.amazonaws.com'
    REGISTRY_CREDENTIAL = '003235076673'
    ECR_REPOSITORY = 'black-jack-in-the-pipeline'
    ECR_REGION = 'eu-central-1'

    /*---Docker Build configuration---*/
    VERSION = 'latest'
    /* DOCKERFILE_PATH = '/home/ubuntu/artifacts/' */
  }

  stages {
    stage('Source'){
      steps {
        git branch: 'main',
            credentialsId: 'github',
            url: 'https://github.com/Szak0/blackjack-in-the-pipeline.git'
      }
    }

    stage('Build') {
      steps {
        sh """
          docker info
          docker build -t ${ECR_REPOSITORY}:${BUILD_NUMBER} .
          docker tag ${ECR_REPOSITORY}:${BUILD_NUMBER} ${REGISTRY}/${ECR_REPOSITORY}:${VERSION}
        """
      }
    }

    stage('Deploy') {
      steps {
        sh "echo Deploy ${ECR_REPOSITORY}:${BUILD_NUMBER} to AWS ECR"
        script {
          docker.withRegistry("https://${REGISTRY}", "ecr:${ECR_REGION}:${REGISTRY_CREDENTIAL}") {
              docker.image("${REGISTRY}/${ECR_REPOSITORY}").push("${VERSION}")
          }
        }
      }
    }

    stage('Post-Deploy') {
      steps {
        sh "echo Creating artifacts..."
        archiveArtifacts artifacts: '**/*', fingerprint: true        
      }
    }
  }

  post {
    success {
      sh "echo Successfully builded docker image and pushed it to ECR. ${ECR_REPOSITORY}:${BUILD_NUMBER}" 
    }
    failure {
      sh "echo Failed"
    }
  }
}
