# 使用官方 Node 镜像
FROM node:22

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝项目所有文件
COPY . .

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["npx", "vite-node", "--watch", "server.ts"]