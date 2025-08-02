import { appendFile, readFile, writeFile } from 'fs/promises';
import { createServer } from 'http';
import path from 'path';    
import crypto from "crypto";

const port = 3000;
const FILEPATH = path.join("data","links.json")

const serveFile = async (res,fileName,fileType)=>{
      try {
            const data = await readFile(fileName);
            res.writeHead(200, {'Content-Type':fileType});
            res.end(data);
        } catch (error) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 file not found');
        }
}
const saveLinks = async (links)=>{
   await writeFile(FILEPATH, JSON.stringify(links))
   return ;
}
const loadLinks = async () => {
    try{
     const data = await readFile(FILEPATH, 'utf-8')
        return JSON.parse(data);
    }
    catch(error){       
        if (error.code === "ENOENT") {
        await writeFile(FILEPATH,'')
        return {};
        }
    throw error;
    }
 }
const server = createServer( async(req,res)=>{
    if(req.method === 'GET' ){
         if(req.url === '/'){
           return serveFile(res,path.join('url', 'index.html'),'text/html')
         }
         else if(req.url === '/style.css'){
           return serveFile(res,path.join('url', 'style.css'),'text/css')
         }
    }
    if(req.method === 'POST' && req.url === '/shorten'){
        const links = await loadLinks();
        let body = ""
        req.on('data',(chunk) =>(
          body += chunk
        ))
        req.on('end',async()=>{
            const { url, shortCode } = JSON.parse(body);
             if(!url) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
               return res.end( 'URL is required' );
             }
              const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
              if(links[finalShortCode]) {
                 res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("Short code already exists. Please choose another.");
              }
               links[finalShortCode] = url;
              await saveLinks(links);
        res.writeHead(200, { "Content-Type": "application/JSON" });
         res.end(JSON.stringify({ success: true, shortCode: finalShortCode  }));
        })
    }
})
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});