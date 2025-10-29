FROM node:22-alpine3.21

WORKDIR /app

# # docker compose run --rm frontend npx create-next-app@latest . でNext.jsがインストールされpackage.jsonも自動作成されるため不要
# # src とは別に package.json をコピーして依存インストール
# COPY package.json ./
# RUN npm install

# # ソースコードはボリュームマウントで上書きされるのでコピー不要

# CMD ["npm", "run", "dev"]