# Ticketing Project

## Status
![deploy-payments](https://github.com/georgekaran/ticketing/workflows/deploy-payments/badge.svg)
![deploy-expiration](https://github.com/georgekaran/ticketing/workflows/deploy-expiration/badge.svg)
![deploy-tickets](https://github.com/georgekaran/ticketing/workflows/deploy-tickets/badge.svg)
![deploy-orders](https://github.com/georgekaran/ticketing/workflows/deploy-orders/badge.svg)
![deploy-client](https://github.com/georgekaran/ticketing/workflows/deploy-client/badge.svg)
![deploy-auth](https://github.com/georgekaran/ticketing/workflows/deploy-auth/badge.svg)
![tests-tickets](https://github.com/georgekaran/ticketing/workflows/tests-tickets/badge.svg)
![tests-payments](https://github.com/georgekaran/ticketing/workflows/tests-payments/badge.svg)
![tests-orders](https://github.com/georgekaran/ticketing/workflows/tests-orders/badge.svg)
![tests-auth](https://github.com/georgekaran/ticketing/workflows/tests-auth/badge.svg)

A microservices event-driven project using K8S, Docker and Node.js.

## Project Tecnologies:

1. Node.js
2. Typescript
3. Docker
4. NATS
5. Kubernetes
6. React
7. Next.js
  
## Prerequisites

1. Minikube - https://kubernetes.io/docs/setup/learning-environment/minikube/
2. Skaffold - https://skaffold.dev/
3. Docker   - https://docs.docker.com/get-docker/
4. Node.js  - https://nodejs.org/en/

## Running

**Note:** Make sure to start the minikube

```bash
  minikube start
```

Then on the root of the project:

```bash
  skaffold dev
```

## About NATS

![Logo](https://nats.io/img/logo.png)

> NATS.io is a simple, secure and high performance open source messaging system for cloud native applications, IoT messaging, and microservices architectures.