pipeline {
  agent any

  environment {
    REGISTRY = '003235076673.dkr.ecr.eu-central-1.amazonaws.com'
    CREDENTIAL = '003235076673'
    REGION = 'eu-central-1'
    ECR_REPOSITORY = 'black-jack-in-the-pipeline'
    VERSION = 'latest'
    AWS_ACCESS_KEY_ID     = credentials('jenkins-aws-access-key')
    AWS_SECRET_ACCESS_KEY = credentials('jenkins-secret-access-key')
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
            docker.image("${ECR_REPOSITORY}").push("${VERSION}") 
          }
        }
      }
    }


    stage("Check") {
      steps {
        
        sh "aws --version"
        sh "kubectl version --short --client"
        sh "eksctl version"
        sh "cat deployment/black-jack-app-deployment.yaml"
      }
    }


    stage("Config aws") {
      steps { 
        sh 'aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID'
        sh 'aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY'
        sh "aws configure set default.region eu-central-1"
        sh "aws sts get-caller-identity"
      }
    }


    stage("Deploy to cluster") {
      steps {
        sh "ls -al"
        sh "aws eks --region eu-central-1 update-kubeconfig --name server-1"
        sh "kubectl config set-context arn:aws:eks:eu-central-1:003235076673:cluster/server-1"
        sh "kubectl get svc"
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
