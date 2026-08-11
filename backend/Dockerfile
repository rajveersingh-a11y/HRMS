FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port uvicorn is running on
EXPOSE 8000

# Create data directory with appropriate permissions
RUN mkdir -p /app/data && chmod -R 777 /app/data

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
