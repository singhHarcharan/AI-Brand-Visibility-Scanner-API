from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import time
import sys
import os

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from common.models.schemas import ScanRequest, ScanResponse
from backend.services.analyzer import BrandAnalyzer

load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Brand Visibility Scanner",
    description="Scan and analyze brand visibility across AI-generated content using Claude.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = BrandAnalyzer()


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "AI Brand Visibility Scanner is running."}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}


@app.post("/scan", response_model=ScanResponse, tags=["Scanner"])
async def scan_brand(request: ScanRequest):
    """
    Scan brand visibility for a given brand name and list of queries.
    Returns visibility scores, mentions, and sentiment analysis.
    """
    start_time = time.time()
    logger.info(f"🚀 Starting scan for brand '{request.brand_name}' with {len(request.queries)} queries")
    
    try:
        result = await analyzer.scan(request)
        elapsed_time = time.time() - start_time
        logger.info(f"✅ Scan completed in {elapsed_time:.2f}s - Visibility score: {result.visibility_score:.2f}")
        return result
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(f"❌ Scan failed after {elapsed_time:.2f}s: {str(e)}")
        raise
