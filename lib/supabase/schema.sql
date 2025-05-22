-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 启用RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 创建访问策略
CREATE POLICY "允许用户读取自己的记录" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "允许服务端管理用户记录" ON users
  USING (true)
  WITH CHECK (true);

-- 创建更新触发器保持updated_at最新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at(); 