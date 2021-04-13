@Library('github.com/releaseworks/jenkinslib') _

pipeline {
  agent any

  environment {
    /*---AWS ECR Credentials---*/
    /*---003235076673.dkr.ecr.eu-central-1.amazonaws.com/black-jack-in-the-pipeline---*/
    REGISTRY = '003235076673.dkr.ecr.eu-central-1.amazonaws.com'
    REGISTRY_CREDENTIAL = credentials('003235076673')
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
        script {
        docker.build("szak0/blackjack-docker-repo")
        }
      }
    }

    
      
    stage('Push to docker hub') {
      steps {
        sh 'rm  ~/.dockercfg || true'
        sh 'rm ~/.docker/config.json || true'
        script {
          docker.withRegistry("https://003235076673.dkr.ecr.eu-central-1.amazonaws.com", 'ecr:eu-central-1:003235076673')   
          { 
            docker.image("szak0/blackjack-docker-repo").push('latest') 
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
