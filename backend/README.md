# Backend

## Comments 
#### For Migrations
```bash
python.exe -m  alembic revision --autogenerate -m "Table Users Migration"
```

### For Upgrade Migrations 
```bash
python.exe -m  alembic upgrade head
```