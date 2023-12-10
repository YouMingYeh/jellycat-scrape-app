# !pip install twder
import twder
import pandas as pd
from ipywidgets import interact, widgets

# Download this first: https://googlechromelabs.github.io/chrome-for-testing/
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import pyautogui
import time
import copy

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_rate(currency):
    data = twder.now(currency)
    df = pd.DataFrame(data)
    df.index = ['時間', '現金買入', '現金賣出', '即期買入', '即期賣出']
    return df.to_dict()

def format_data(data):
    parsed_data = {}
    for item in data:
        parsed_data[item[0]] = item[1]
    return parsed_data

def modify_price(price):
    integer_part = int(price)

    # 如果個位數和十位數的組合小於50，將十位數設為8
    # 否則，進位到下一個百位，將十位數設為2
    if integer_part % 100 < 50:
        modified_integer = (integer_part / 100) * 100 + 80
    else:
        modified_integer = ((integer_part / 100) + 1) * 100 + 20

    return modified_integer

    
def compute_jellycat_price(price):
    jellycat_price = copy.deepcopy(price)
    for qutation in jellycat_price:
        price_str = qutation[1].replace('€', '')  # 去除價格字串中的 '€' 符號
        price = float(price_str)  # 將去除 '€' 符號後的價格轉換為浮點數
        product_name = qutation[0]
        
        # 根據價格和產品名稱應用不同的規則
        if 'bag' in product_name.lower():
            new_price = price * 1.2 * EUR
        elif price < 40:
            new_price = price * 1.15 * EUR
        elif price > 40 and price <= 100:
            new_price = price * 1.1 * EUR
        else:
            new_price = price * 1.05 * EUR

        new_price = round(new_price, 2)


        modified_price = modify_price(new_price)

        qutation[1] = modified_price
        
    return jellycat_price

def compute_jellycat_cost(price):
    jellycat_cost = copy.deepcopy(price)
    for jelly_cost in jellycat_cost:
        price_str = jelly_cost[1].replace('€', '')  # 去除價格字串中的 '€' 符號
        price = float(price_str)  # 將去除 '€' 符號後的價格轉換為浮點數

        # 將價格乘以0.95
        new_price = round(price * 0.95 * EUR, 2) 

        jelly_cost[1] = new_price
        jelly_cost = jelly_cost[:2]
    return jellycat_cost

def compute_selfridge_cost(price):
    #selfridge成本價
    selfridge_costs = copy.deepcopy(price)
    for selfridge_cost in selfridge_costs:
        price_str = selfridge_cost[1].replace('$', '').replace(',', '')
        price = float(price_str)

        # 將價格乘以0.9
        new_price = round(price * 0.9, 2)

        selfridge_cost[1] = new_price
    return selfridge_costs

def compute_campusgifts_cost(price):
    campusgifts_costs = copy.deepcopy(price)
    #Campusgifts成本價
    for campusgifts_cost in campusgifts_costs:

        price_str = campusgifts_cost[1].replace('£', '').replace(',', '')
        price = float(price_str)

        # 將價格乘以1.1
        new_price = round(price * 1.1 * GBP, 2)

        campusgifts_cost[1] = new_price
    
    return campusgifts_costs

#代購價與成本價間的比價
def compare_prices(quotation, jelly_cost, selfridge_cost, campusgifts_cost):
    differenciate_result = {}

    if quotation[1] == None: 
        return differenciate_result
    else :
        q_price = quotation[1]
    
    if jelly_cost[1] == None: 
        j_diff = -9999
    else:
        j_diff = quotation[1] - jelly_cost[1]
        
    if selfridge_cost[1] == None:
        s_diff = -9999
    else:
        s_diff = quotation[1] - selfridge_cost[1]
        
    if campusgifts_cost[1] == None:
        c_diff = -9999
    else:
        c_diff = quotation[1] - campusgifts_cost[1]
        
    # 將結果儲存到字典中
    differenciate_result[quotation[0]] = {'quotation_price': q_price, 'jelly_cost_diff': j_diff, 'selfridge_cost_diff': s_diff, 'campusgifts_cost_diff': c_diff}

    return differenciate_result

class Crawler:
    def __init__(self):
        self.jellycat = list()
        self.selfridge = list()
        self.campusgifts = list()
    
    def jellycat_webSelenium(self):
        jellycat_data_store1 = list()
        jellycat_data_store2 = list()
        jellycat_data_store3 = list()
        jellycat_data_store4 = list()
        # set webdriver service
        service = Service(executable_path="./chromedriver.exe")
        # set webdriver option
        option = webdriver.ChromeOptions()
        # set web always opens
        option.add_experimental_option("detach", True)
        # error notion skip
        option.add_experimental_option("excludeSwitches", ["enable-logging"])

        driver = webdriver.Chrome(service=service, options=option)
        driver.get("https://www.jellycat.com/eu/all-soft-toys/?stock_text=in%20stock&page")  # URL
        time.sleep(2)

        data_index = driver.find_element(
            By.CSS_SELECTOR,
            "#productDataOnPagex",
        )
        # count the max-page
        get_index = int(data_index.get_attribute("data-nq-maxpages"))

        # rolling the web to load the dynamic data -> need to wait
        for num in range(1, get_index + 1, 1):
            # slide-down the web 10000 pixel-sized
            driver.execute_script("window.scrollBy(0,10000)")
            time.sleep(1)

        for i in range(1, get_index + 1, 1):
            data_index = driver.find_element(
                By.XPATH,
                '//*[@id="productDataOnPagex"]/div[' + str(i) + "]",
            )
            pr = data_index.find_elements(By.CLASS_NAME, "listing-details")

            # store the data to variable
            for j in pr:
                if i > 0 and 10 >= i:
                    jellycat_data_store1.append(j.text.split("\n"))
                elif i > 10 and 20 >= i:
                    jellycat_data_store2.append(j.text.split("\n"))
                elif i > 20 and 30 >= i:
                    jellycat_data_store3.append(j.text.split("\n"))
                else:
                    jellycat_data_store4.append(j.text.split("\n"))
        driver.close()
        
        self.jellycat.extend(jellycat_data_store1)
        self.jellycat.extend(jellycat_data_store2)
        self.jellycat.extend(jellycat_data_store3)
        self.jellycat.extend(jellycat_data_store4)
        
        print(self.jellycat)


    def selfridge_webSelenium(self):
        selfridge_data_store1 = list()
        selfridge_data_store2 = list()
        service = Service(executable_path="./chromedriver.exe")
        option = webdriver.ChromeOptions()
        option.add_experimental_option("detach", True)
        option.add_experimental_option("excludeSwitches", ["enable-logging"])
        for t in range(1, 7, 1):
            driver = webdriver.Chrome(service=service, options=option)
            driver.get("https://www.selfridges.com/TW/en/cat/jellycat/?pn=" + str(t))
            time.sleep(2)

            css_path = "#content"
            data = driver.find_element(By.CSS_SELECTOR, css_path)
            name = data.find_elements(By.CLASS_NAME, "c-prod-card__cta-box-description")
            price = data.find_elements(By.CLASS_NAME, "c-prod-card__cta-box-price")

            # store the data to variable
            for i in range(0, len(name), 1):
                if t > 0 and 3 >= t:
                    selfridge_data_store1.append([name[i].text, price[i].text])
                elif t > 3 and 7 >= t:
                    selfridge_data_store2.append([name[i].text, price[i].text])
            driver.close()
            
        self.selfridge.extend(selfridge_data_store1)
        self.selfridge.extend(selfridge_data_store2)
        


    def campusgifts_webdriver(self):
        campusgifts_data_store1 = list()
        campusgifts_data_store2 = list()
        campusgifts_data_store3 = list()

        service = Service(executable_path="./chromedriver.exe")
        option = webdriver.ChromeOptions()
        option.add_experimental_option("detach", True)
        option.add_experimental_option("excludeSwitches", ["enable-logging"])
        driver = webdriver.Chrome(service=service, options=option)
        driver.get(
            "https://www.campusgifts.co.uk/gifts-by-brand/jellycat/browse-all?product_list_limit=96"
        )
        time.sleep(0.25)
        data_index = driver.find_elements(
            By.CSS_SELECTOR, "#amasty-shopby-product-list > div:nth-of-type(2) > ol >li"
        )

        for data in data_index:
            try:
                name = data.find_element(By.CLASS_NAME, "product-item-link")
                try:
                    price = data.find_element(By.CLASS_NAME, "old-price")
                except:
                    continue
                try:
                    price = data.find_element(By.CLASS_NAME, "special-price")
                except:
                    continue
            except:
                continue

        for i in range(2, 11, 1):
            pyautogui.hotkey("ctrl", "t", interval=0.1)
            driver.switch_to.window(driver.window_handles[1])
            driver.get(
                "https://www.campusgifts.co.uk/gifts-by-brand/jellycat/browse-all?p="
                + str(i)
                + "&product_list_limit=96"
            )
            driver.switch_to.window(driver.window_handles[0])
            driver.close()
            driver.switch_to.window(driver.window_handles[0])
            time.sleep(2)
            data_index = driver.find_elements(
                By.CSS_SELECTOR, "#amasty-shopby-product-list > div:nth-of-type(2) > ol >li"
            )

            for data in data_index:
                try:
                    name = data.find_element(By.CLASS_NAME, "product-item-link")
                    try:
                        price = data.find_element(By.CLASS_NAME, "old-price")
                    except:
                        continue
                    try:
                        price = data.find_element(By.CLASS_NAME, "special-price")
                    except:
                        continue
                except:
                    continue

                # store the data to variable
                if i > 0 and 4 >= i:
                    campusgifts_data_store1.append([name.text, price.text])
                elif i > 4 and 8 >= i:
                    campusgifts_data_store2.append([name.text, price.text])
                elif i > 8 and 12 > i:
                    campusgifts_data_store3.append([name.text, price.text])

        driver.close()
        
        self.campusgifts.extend(campusgifts_data_store1)
        self.campusgifts.extend(campusgifts_data_store2)
        self.campusgifts.extend(campusgifts_data_store3)
crawler = Crawler() 

EUR = 34
GBP = 39 

@app.route('/update_rate', methods=['GET'])
def update_rate():
    global EUR
    global GBP
    EUR = float((get_rate('EUR'))[0]['現金賣出'])
    GBP = float((get_rate('GBP'))[0]['現金賣出'])
    return jsonify({'EUR': EUR, 'GBP': GBP})


@app.route('/get_jellycat', methods=['GET'])
def get_jellycat():
    global EUR
    global GBP
    global crawler
    jellycat_price = compute_jellycat_cost(crawler.jellycat)
    return jsonify(format_data(jellycat_price))

@app.route('/get_selfridge', methods=['GET'])
def get_selfridge():
    global EUR
    global GBP
    global crawler
    selfridge_price = compute_selfridge_cost(crawler.selfridge)
    return jsonify(format_data(selfridge_price))

@app.route('/get_campusgifts', methods=['GET'])
def get_campusgifts():
    global EUR
    global GBP
    global crawler
    campusgifts_price = compute_campusgifts_cost(crawler.campusgifts)
    return jsonify(format_data(campusgifts_price))

@app.route('/get_price', methods=['GET'])
def get_price():
    global EUR
    global GBP
    global crawler
    jellycat_price = compute_jellycat_price(crawler.jellycat)
    return jsonify({'jellycat': format_data(jellycat_price)})

@app.route('/get_all', methods=['GET'])
def get_all():
    global crawler
    
    return jsonify({'jellycat': format_data(crawler.jellycat), 'selfridge': format_data(crawler.selfridge), 'campusgifts': format_data(crawler.campusgifts)})

@app.route('/', methods=['POST'])scrape
def scrape():
    global crawler
    crawler.jellycat_webSelenium()
    crawler.selfridge_webSelenium()
    crawler.campusgifts_webdriver()
    return jsonify({'jellycat': format_data(crawler.jellycat), 'selfridge': format_data(crawler.selfridge), 'campusgifts': format_data(crawler.campusgifts)})

@app.route('/scrape_specific', methods=['POST'])
def scrape_specific():
    global crawler
    website = request.json.get('website')
    if website == 'jellycat':
        crawler.jellycat_webSelenium()
        return jsonify({'jellycat': format_data(crawler.jellycat)})
    elif website == 'selfridge':
        crawler.selfridge_webSelenium()
        return jsonify({'selfridge': format_data(crawler.selfridge)})
    elif website == 'campusgifts':
        crawler.campusgifts_webdriver()
        return jsonify({'campusgifts': format_data(crawler.campusgifts)})
    else:
        return jsonify({'error': 'Invalid website'})



from fuzzywuzzy import process

@app.route('/compare_prices', methods=['GET'])
def compare_prices_api():
    global crawler
    name = request.args.get('name')
    if name is None:
        return jsonify({'error': 'Missing name parameter'})

    jellycat_price = compute_jellycat_price(crawler.jellycat)
    jellycat_price_dict = format_data(jellycat_price)
    jellycat_cost = compute_jellycat_cost(crawler.jellycat)
    jellycat_cost_dict = format_data(jellycat_cost)
    selfridge_cost = compute_selfridge_cost(crawler.selfridge)
    selfridge_cost_dict = format_data(selfridge_cost)
    campusgifts_cost = compute_campusgifts_cost(crawler.campusgifts)
    campusgifts_cost_dict = format_data(campusgifts_cost)

    # Find the most similar name in each dictionary
    name_jellycat_price = process.extractOne(name, jellycat_price_dict.keys())[0]
    name_jellycat_cost = process.extractOne(name, jellycat_cost_dict.keys())[0]
    name_selfridge_cost = process.extractOne(name, selfridge_cost_dict.keys())[0]
    name_campusgifts_cost = process.extractOne(name, campusgifts_cost_dict.keys())[0]

    quotation = [name, jellycat_price_dict.get(name_jellycat_price)]
    jelly_cost = [name, jellycat_cost_dict.get(name_jellycat_cost)]
    selfridge_cost = [name, selfridge_cost_dict.get(name_selfridge_cost)]
    campusgifts_cost = [name, campusgifts_cost_dict.get(name_campusgifts_cost)]

    differenciate_result = compare_prices(quotation, jelly_cost, selfridge_cost, campusgifts_cost)
    return jsonify(differenciate_result)

@app.route('/compare_prices_with_names', methods=['GET'])
def compare_prices_with_names_api():
    global crawler
    jellycat_name = request.args.get('jellycat_name')
    selfridge_name = request.args.get('selfridge_name')
    campusgifts_name = request.args.get('campusgifts_name')
    
    if jellycat_name is None:
        return jsonify({'error': 'Missing name parameter'})

    jellycat_price = compute_jellycat_price(crawler.jellycat)
    jellycat_price_dict = format_data(jellycat_price)
    jellycat_cost = compute_jellycat_cost(crawler.jellycat)
    jellycat_cost_dict = format_data(jellycat_cost)
    selfridge_cost = compute_selfridge_cost(crawler.selfridge)
    selfridge_cost_dict = format_data(selfridge_cost)
    campusgifts_cost = compute_campusgifts_cost(crawler.campusgifts)
    campusgifts_cost_dict = format_data(campusgifts_cost)

    # Find the most similar name in each dictionary
    name_jellycat_price = process.extractOne(jellycat_name, jellycat_price_dict.keys())[0]
    name_jellycat_cost = process.extractOne(jellycat_name, jellycat_cost_dict.keys())[0]
    name_selfridge_cost = process.extractOne(selfridge_name, selfridge_cost_dict.keys())[0]
    name_campusgifts_cost = process.extractOne(campusgifts_name, campusgifts_cost_dict.keys())[0]

    quotation = [jellycat_name, jellycat_price_dict.get(name_jellycat_price)]
    jelly_cost = [name_jellycat_cost, jellycat_cost_dict.get(name_jellycat_cost)]
    selfridge_cost = [name_selfridge_cost, selfridge_cost_dict.get(name_selfridge_cost)]
    campusgifts_cost = [name_campusgifts_cost, campusgifts_cost_dict.get(name_campusgifts_cost)]

    differenciate_result = compare_prices(quotation, jelly_cost, selfridge_cost, campusgifts_cost)
    return jsonify(differenciate_result)


if __name__ == '__main__':
    crawler.jellycat_webSelenium()
    crawler.selfridge_webSelenium()
    crawler.campusgifts_webdriver()
    EUR = float((get_rate('EUR'))[0]['現金賣出'])
    print("EUR: ")
    print(EUR)
    GBP = float((get_rate('GBP'))[0]['現金賣出'])
    print("GBP: ")
    print(GBP)

    app.run(host='0.0.0.0', port=5000)
