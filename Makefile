
frontend-image:
	docker build -t mula-frontend:latest .

frontend-container:
	docker run --name mula-frontend --rm  -it -p 3000:80/tcp mula-frontend:latest

.PHONY: frontend-image frontend-container