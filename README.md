# Cloud Computing Coursework  (CSYE6225)

Introduction: AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers, creating workload-aware cluster scaling logic, maintaining event integrations, or managing runtimes. With Lambda, you can run code for virtually any type of application or backend service - all with zero administration. Just upload your code as a ZIP file or container image, and Lambda automatically and precisely allocates compute execution power and runs your code based on the incoming request or event, for any scale of traffic. You can set up your code to automatically trigger from 140 AWS services or call it directly from any web or mobile app. You can write Lambda functions in your favorite language (Node.js, Python, Go, Java, and more) and use both serverless and container tools, such as AWS SAM or Docker CLI, to build, test, and deploy your functions.

It does not require the typical architecture involved in running other cloud applications. The primary payload to a lambda service is in the form of a .zip file, which is to be uploaded, and the platform unpackages it itself, and runs the application contained in it.

In this implementation, we have used a CI/CD pipeline to integrate code changes whenever new updates are pushed to the serverless github repository. These changes are automated and updated in the lambda function by means of uploading the payload artifact to a S3 bucket, and then updating the lambda with the new application.

1. GitHub account
2. Zip artifact containg application in language of your choice, in this implementation the primary language is Node.js/Javascript
3. Service to invoke the Lambda function, in this case it is AWS SNS
4. AWS Account
5. REST API testing tool - preferably Postman
6. Cloud Infrastructure, in this case created by Terraform


Build and Deploy Steps:
1. Create your Node.js application in the editor of your choice and commit changes to the serverless GitHub repository.
2. Create a pull request to merge with codebase of main organization repository, and wait for pull request review.
3. Once pull request has been approved, the code will be merged into main branch, and CI/CD pipeline will initiate process of building artifact and publishing it to S3 bucket.
4. The pipeline after publishing to S3 will update the serverless code in AWS Lambda with newly updated code, and provide success message.
5. Monitor application working in CloudWatch logs, where new log stream wil be created for the new Lambda deployment.