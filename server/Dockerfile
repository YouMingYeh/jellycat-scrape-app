# Use the specified image as the base
FROM joyzoursky/python-chromedriver:latest

# Set the working directory
WORKDIR /usr/workspace

# Install xvfb
RUN apt-get update && apt-get install -y xvfb


# Copy the local directory contents to the container
COPY . .

# Install the requirements
RUN pip install -r requirements.txt

# Expose port 5000
EXPOSE 5000

# Run the command when the container launches
CMD xvfb-run --server-args="-screen 0 1024x768x24" python server.py
