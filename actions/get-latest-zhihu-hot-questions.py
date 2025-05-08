from bs4 import BeautifulSoup
import json
import uuid
import requests
import time


os.environ['TZ'] = 'Asia/Shanghai'
time.tzset()

response = requests.get('https://tophub.today/n/mproPpoq6O', headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)

# Check if the request was successful
if response.status_code == 200:
    html_content = response.text
else:
    print(f"Failed to fetch the page. Status code: {response.status_code}")
    exit()

# Parse HTML with BeautifulSoup
soup = BeautifulSoup(html_content, 'html.parser')

# Find the table containing the hot list
table = soup.select_one('div.jc-c table.table')

# Initialize list to store hot list items
hotlist = []

# Iterate through each row in the table body
for row in table.find('tbody').find_all('tr'):
    cols = row.find_all('td')
    
    # Extract data from columns
    rank = cols[0].text.strip().rstrip('.')  # Remove trailing dot from rank
    title_link = cols[1].find('a')
    title = title_link.text.strip()
    link = title_link['href']
    heat = cols[2].text.strip()
    
    # Check if the first column contains a date (for historical entries)
    date = None
    if cols[0].get('width') == '80px':
        date = cols[0].text.strip()
        rank = None  # No rank for dated entries
    
    # Create item dictionary
    item = {
        'rank': rank,
        'title': title,
        'link': link,
        'heat': heat
    }
    
    hotlist.append(item)

# Output the scraped data as JSON
output = {
    'artifact_id': str(uuid.uuid4()),
    'title': 'Zhihu Hot List',
    'data': hotlist,
    'generated_at': time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
}

# Save to JSON file
with open('../outputs/zhihu_hotlist.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

# Print the JSON output for verification
print('generated zhihu_hotlist.json successfully!')