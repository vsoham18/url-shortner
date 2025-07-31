import { readFile } from 'fs/promises';
import { createServer } from 'http';
import path from 'path';    
import crypto from "crypto";
import { write } from 'fs';

const port = 3000;
const FILEPATH = path.join('data','links.json')

const serveFile = async (res,fileName,fileType)=>{

      try {
            const data = await readFile();
            res.writeHead(200, {'Content-Type':fileType});
            res.end(data);
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('404 file not found');
        }
}
const saveLinks = async (links)=>{
   await writeFile(FILEPATH, JSON.stringify(links))
}
const loadLinks = async () => {
    try{
     const data = await readFile(FILEPATH, 'utf-8')
        return JSON.parse(data);
    }
    catch(error){       
        if (error.code === "ENOENT") {
        await writeFile(DATA_FILE, JSON.stringify({}));
        return {};
        }
    throw error;
    }
 }
const server = createServer( (req,res)=>{
    if(req.method === 'GET' ){
         if(req.url === '/'){
            serveFile(res,'index.html','text/html')
         }
         else if(req.url === '/style.css'){
            serveFile(res,'style.css','text/css')
         }
    }
    if(req.method === 'POST' && req.url === '/shorten'){
        const links = loadLinks();
        let body = ''
        req.on('data',chunk =>{
            body += chunk
        })
        req.on('end',()=>{
            const { url, shortCode } = JSON.parse(body);
             if(!url) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ error: 'URL is required' }));
                return;
             }
              const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
              if(links[finalShortCode]) {
                 res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("Short code already exists. Please choose another.");
              }
               links[finalShortCode] = url;
               saveLinks(links);
        })
    }
})
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});