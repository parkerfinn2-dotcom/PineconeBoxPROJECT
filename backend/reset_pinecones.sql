-- 重置所有用户的松果数量为0
UPDATE users SET pinecone_count = 0;

-- 查看重置后的结果
SELECT id, username, pinecone_count FROM users;
