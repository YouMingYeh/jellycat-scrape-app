# Use the specified image as the base
FROM joyzoursky/python-chromedriver:latest

# Install xvfb
RUN apt-get update && apt-get install -y xvfb

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5000

# Install gunicorn
RUN pip install gunicorn

# Set the entrypoint command
CMD xvfb-run --server-args="-screen 0 1024x768x24" gunicorn -b 0.0.0.0:5000 --timeout 600 server:app