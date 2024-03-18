import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "socialmediasite.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7251';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            },
            '^/main': {
                target,
                secure: false
            },
            '^/pingauth': {
                target,
                secure: false
            },
            '^/register': {
                target,
                secure: false
            },
            '^/login': {
                target,
                secure: false
            },
            '^/logout': {
                target,
                secure: false
            },
            '^/signup': {
                target,
                secure: false
            },

            '^/posts': {
                target,
                secure: false
            },
            '^/comments': {
                target,
                secure: false
            },
            '^/bannerpicture': {
                target,
                secure: false
            },
            '^/profilepicture': {
                target,
                secure: false
            },
            '^/aboutme': {
                target,
                secure: false
            },
            '^/users': {
                target,
                secure: false
            }, 
            '^/singleuser': {
                target,
                secure: false
            },
            '^/singleuserposts': {
                target,
                secure: false
            },
            '^/follow': {
                target,
                secure: false
            },
            '^/following': {
                target,
                secure: false
            }
            ,
            '^/followcounts': {
                target,
                secure: false
            },
            '^/like': {
                target,
                secure: false
            },
            '^/likecomment': {
                target,
                secure: false
            },
            '^/notificationcount': {
                target,
                secure: false
            },
            '^/notifications': {
                target,
                secure: false
            },
            '^/singlepost': {
                target,
                secure: false
            },
            '^/messages': {
                target,
                secure: false,
                ws: true
            }


        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        },

    }
})
