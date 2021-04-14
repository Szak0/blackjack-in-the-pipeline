pipeline {
  agent any

  environment {
    REGISTRY = '003235076673.dkr.ecr.eu-central-1.amazonaws.com'
    CREDENTIAL = '003235076673'
    REGION = 'eu-central-1'
    ECR_REPOSITORY = 'black-jack-in-the-pipeline'
    VERSION = 'latest'
  }

  stages {

    stage('Load sources') {
      steps {
        git branch: 'main',
            credentialsId: 'github',
            url: 'https://github.com/Szak0/blackjack-in-the-pipeline.git'
      }
    }


    stage('Build image') {
      steps {
        script {
          docker.build("${ECR_REPOSITORY}")
        }
      }
    }


    stage('Push to ECR') {
      steps {
        script {
          docker.withRegistry("https://${REGISTRY}", "ecr:${REGION}:${CREDENTIAL}") { 
            docker.image("${ECR_REPOSITORY}").push("${VERSION}-${BUILD_NUMBER}") 
          }
        }
      }
    }

/*
    stage("Create cluster") {
      steps {
        sh "aws --version"
      }
    }
*/

    stage("Deploy to cluster") {
      steps {
        sh "
        kubectl config set-context arn:aws:eks:eu-central-1:003235076673:cluster/server-1
        kubectl apply -f deployment/black-jack-app-deployment.yaml
        "
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
