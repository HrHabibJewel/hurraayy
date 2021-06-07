node {
  try {
    stage('Checkout') {
      checkout scm
    }
    stage('Environment') {
      sh 'git --version'
      echo "Branch: ${env.BRANCH_NAME}"
      sh 'docker -v'
      sh 'printenv'
    }
  
    stage('Deploy'){
        sh 'docker build -t hurraayy-app --no-cache .'
      
    }
  }
  catch (err) {
    throw err
  }
}