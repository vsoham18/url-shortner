import { readFile } from 'fs/promises';
import { createServer } from 'http';
import path from 'path';     
const port = 3000;
const serveFile = async (res,fileName,fileType)=>{
      try {
            const data = await readFile(path.join('url', fileName));
            res.writeHead(200, {'Content-Type':fileType});
            res.end(data);
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('404 file not found');
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
})
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});