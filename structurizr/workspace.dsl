workspace "WebDeveloperCompanion" "Deployment diagram" {

  model {
    webDeveloperCompanion = softwareSystem "WebDeveloperCompanion" "Allows the user to manage and guery, public technical content regarding Web development (such as tutorials, presentations etc.) from multiple sources." {
      serverlessApplication = container "BE Serverless Service" "Allows the user to manage and query, public technical content regarding Web development (such as tutorials, presentations etc.) from multiple sources." "Java" {
        tags "Application"
      }

      database = container "RDF Database" "Stores information in RDF format regarding Web development technical content." "RDF Database" {
        tags "Database"
      }

      userDirectoryService = container "User Authentication Service" "Service that handles user authentication and holds sensitive user data in a directory." "Keycloack"
    
      spaApplication = container "SPA Application" "Front-end application that provides an user friendly interface for WebDeveloperCompanion application." "React with Typescript" {
        tags "Application"
      }

      lambdaAuthorizerService = container "Lambda Authorization Service" "Service that handles user authorization." "AWS Lambda Custom Authorizer" {
        tags "Application"
      }

      webScrapingService = container "Web Scraping Service" "Services used for scraping external data sources" "AWS Lambda" {
        tags "Application"
      }
    }

    spaApplication -> userDirectoryService "Authenticates user " "HTTPS"
    spaApplication -> lambdaAuthorizerService "Request and sends data to " "HTTPS"
    lambdaAuthorizerService -> serverlessApplication "Authorizes and sends request to " "Event Trigger"
    serverlessApplication -> database "Queries and persists data to " "SPARQL protocol"
    webScrapingService -> database "Queries and persists data to " "SPARQL protocol"

    dev = deploymentEnvironment "Dev" {
      deploymentNode "Amazon Web Services" {
        tags "Amazon Web Services - Cloud"

        region = deploymentNode "EU-North-1" {
          tags "Amazon Web Services - Region"

          route53 = infrastructureNode "Route 53" {
            description "Highly available and scalable cloud DNS service."
            tags "Amazon Web Services - Route 53"
          }

          waf = infrastructureNode "WAF" {
            description "Highly secure web application firewall."
            tags "Amazon Web Services - WAF"
          }

          deploymentNode "VPC" {
            tags "Amazon Web Services - Virtual Private Cloud"

            ssm = infrastructureNode "SSM" {
              description "System manager with secret configuration storage."
              tags "Amazon Web Services - Systems Manager"
            }

            elastiCache = infrastructureNode "ElastiCache for Redis" {
              description "Caching system using redis."
              tags "Amazon Web Services - ElastiCache ElastiCache for Redis"
            }

            cloudwatch = infrastructureNode "CloudWatch" {
              description "Logging system for cloud resources."
              tags "Amazon Web Services - CloudWatch"
            }

            s3 = infrastructureNode "S3" {
              description "Private S3 bucket for SPA aplication."
              tags "Amazon Web Services - Simple Storage Service Bucket"
            }

            ebs = infrastructureNode "EBS" {
              description "Phisical drive memory for EC2"
              tags "Amazon Web Services - Elastic Block Store"
            }

            queue = infrastructureNode "Queue" {
              description "Messaging queue."
              tags "Amazon Web Services - Simple Queue Service"
            }

            deploymentNode "Lambda Authorizer" {
              tags "Amazon Web Services - AWS Lambda Lambda Function"

              containerInstance lambdaAuthorizerService
            }

            deploymentNode "Api Gateway" {
              tags "Amazon Web Services - Amazon API Gateway"

              deploymentNode "AWS Lambda" {
                tags "Amazon Web Services - AWS Lambda Lambda Function"

                serverlessApplicationInstance = containerInstance serverlessApplication
              }
            }

            deploymentNode "Amazon Neptune" {
              tags "Amazon Web Services - Neptune"

              containerInstance database
            }

            deploymentNode "Amazon EC2" {
              tags "Amazon Web Services - EC2"

              userDirectoryServiceInstance = containerInstance userDirectoryService
            }

            deploymentNode "AWS Cloudfront" {
              tags "Amazon Web Services - CloudFront"

              spaApplicationInstance = containerInstance spaApplication
            }

            deploymentNode "AWS Lambda" {
              tags "Amazon Web Services - AWS Lambda Lambda Function"

              webScrapingServiceInstance = containerInstance webScrapingService
            }
          }
        }
      }

      route53 -> waf "Forwards request to " "HTTPS"
      waf -> spaApplicationInstance "Forwards request to " "HTTPS"
      waf -> serverlessApplicationInstance "Forwards request to " "HTTPS with SPARQL request"

      spaApplicationInstance -> s3 "Reads from and writes to" "IAM Policy"

      serverlessApplicationInstance -> ssm "Retrieves secret data from " "IAM Policy"
      serverlessApplicationInstance -> elastiCache "Retrieves and stores cached data " "IAM policy"
      serverlessApplicationInstance -> cloudwatch "Writes logs" "IAM policy"
      serverlessApplicationInstance -> queue "Writes messages to " "Event Message"

      queue -> webScrapingServiceInstance "Provides messages to " "Event Trigger"
      webScrapingServiceInstance -> cloudwatch "Writes logs" "IAM policy"
      
      userDirectoryServiceInstance -> ebs "Retrieves and persists data to " "IAM policy"
    }
  }

    views {
      deployment webDeveloperCompanion "Dev" "AmazonWebServicesDeployment" {
        include *
        # autolayout lr

        animation {
          route53
        }
      }

      styles {
        element "Element" {
          shape roundedbox
          background #ffffff
        }
        element "Container" {
          background #ffffff
        }
        element "Application" {
          background #ffffff
        }
        element "Database" {
          shape cylinder
        }
      }

      themes https://static.structurizr.com/themes/amazon-web-services-2023.01.31/theme.json
    }

    configuration {
      scope softwaresystem
    }
}