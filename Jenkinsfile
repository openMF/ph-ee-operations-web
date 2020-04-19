pipeline {
    agent any
    stages {
        stage('docker') {
            steps {
                sh 'docker build . -t paymenthubee.azurecr.io/phee/operations-web'
                sh 'docker push paymenthubee.azurecr.io/phee/operations-web'
            }
        }
    }
}
