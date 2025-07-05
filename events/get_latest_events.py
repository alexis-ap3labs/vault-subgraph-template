import os
import argparse
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from the nearest .env file
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME')
MONGODB_COLLECTION_NAME = os.getenv('MONGODB_COLLECTION_NAME')

# Explicit error checking
if not all([MONGODB_URI, MONGODB_DB_NAME, MONGODB_COLLECTION_NAME]):
    raise ValueError("One or more MongoDB environment variables are missing!")

def format_event(event, decimals):
    id = event.get('id', '-')
    assets = event.get('assets', '-')
    
    # Format assets with proper decimal handling
    try:
        assets_formatted = float(assets) / (10 ** decimals)
        assets_str = f"{assets_formatted:.6f}"
    except Exception:
        assets_str = assets
    
    blockTimestamp = event.get('blockTimestamp', '-')
    try:
        date_str = datetime.utcfromtimestamp(int(blockTimestamp)).strftime('%Y-%m-%d %H:%M:%S')
    except Exception:
        date_str = '-'
    
    controller = event.get('controller', '-')
    owner = event.get('owner', '-')
    requestId = event.get('requestId', '-')
    sender = event.get('sender', '-')
    
    print('-------------------------------')
    print(f"ID         : {id}")
    print(f"Assets     : {assets_str}")
    print(f"Timestamp  : {blockTimestamp} ({date_str})")
    print(f"Controller : {controller}")
    print(f"Owner      : {owner}")
    print(f"Request ID : {requestId}")
    print(f"Sender     : {sender}")
    print('-------------------------------')

def get_latest_events(event_type: str, count: int, decimals: int):
    client = MongoClient(MONGODB_URI)
    db = client[MONGODB_DB_NAME]
    collection = db[MONGODB_COLLECTION_NAME]
    
    # Sort from newest to oldest (descending blockTimestamp)
    events = list(collection.find({'type': event_type}).sort('blockTimestamp', -1).limit(count))
    
    if not events:
        print(f"No events of type '{event_type}' found.")
        return
    
    # Display in order from newest to oldest
    for event in events:
        format_event(event, decimals)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Retrieve latest events from MongoDB subgraph database")
    parser.add_argument('--type', type=str, required=True, help="Event type (e.g., depositRequest)")
    parser.add_argument('--count', type=int, default=5, help="Number of results to display")
    parser.add_argument('--decimals', type=int, required=True, help="Number of decimals for asset formatting (e.g., 6 for USDC, 18 for ETH)")
    
    args = parser.parse_args()
    get_latest_events(args.type, args.count, args.decimals) 