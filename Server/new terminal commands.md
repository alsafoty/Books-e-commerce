to initiate prisma :

npx prisma init --datasource-provider postgresql

npm i @prisma/client

after creating the models:
npx prisma generate

creating migration files:
npx prisma migrate dev --name init --create-only

deployment:
npx prisma migrate deploy

Requiring
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

!!!!! important !!!!
when deploying to vercel:

add this to the new file vercel.json(when using sub dirs):
{
"version": 2,
"builds": [{ "src": "src/index.js", "use": "@vercel/node" }],
"routes": [
{
"src": "/(.*)",
"dest": "src/index.js"
}
]
}

make sure to require prisma client form (@prisma/client)

make sure to add this to scripts in package.json file:
"postinstall": "npx prisma generate"

make sure to modify prisma.schema:
generator client {
provider = "prisma-client-js"
binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

!! be careful: mailsender service:

Convert your code to use async/await instead of the callback:
instead of :

const nodemailer = require("nodemailer");

    await transporter.sendMail({

...
});

    do:

        const info = await transporter.sendMail({

...
});
