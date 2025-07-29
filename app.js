import readfile from 'fs/promises';
import { createServer } from 'http';
     
const server =createServer(async (req,res)=>{
    if(req.method === 'GET' && req.url === '/'){
        try {
            const data = await readfile.readFile('index.html', 'utf-8');
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Error reading file');
        }
    }
})