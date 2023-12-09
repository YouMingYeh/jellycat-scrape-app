# jellycat scrape

## Description

This is a simple web scraper that will scrape the [Jellycat](https://www.jellycat.com/) website and other related websites for all of their products and display them in tables. Also, calculates the costs and prices based on the data scraped and domain knowledge.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)

## Prerequisites

1. Python 3.11.5
2. Node 21.1.0
3. Chrome Driver (Download from: https://googlechromelabs.github.io/chrome-for-testing/)
4. Windows 10 (Not tested on other OS)

## Installation

### Download
```
git clone https://github.com/YouMingYeh/jellycat-scrape-app/
cd jellycat-scrape-app
```
### Client
```
cd client
npm i
npm run dev
```

### Server
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python server.py
```

## Usage
open `http://localhost:3000/` in your browser
