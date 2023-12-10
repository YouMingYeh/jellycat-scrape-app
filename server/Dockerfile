    # Use the specified image as the base
    FROM joyzoursky/python-chromedriver:latest

    # Install xvfb
    RUN apt-get update && apt-get install -y xvfb

    # Install Nginx
    RUN apt-get install -y nginx

    # Copy SSL certificates to a specific location in the container
    COPY certificate.pem /etc/nginx/self-signed.crt
    COPY private-key.pem /etc/nginx/self-signed.key

    # Nginx configuration
    COPY nginx.conf /etc/nginx/nginx.conf

    # Copy the local directory contents to the container
    COPY . .

    # Install the requirements
    RUN pip install -r requirements.txt

    # Expose port 80 for Nginx
    EXPOSE 5000

    CMD service nginx start && xvfb-run --server-args="-screen 0 1024x768x24" python server.py && tail -f /var/log/nginx/error.log