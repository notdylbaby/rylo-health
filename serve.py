#!/usr/bin/env python3
"""Python fallback for serve.mjs — used when Node.js isn't installed.
Serves project root on http://localhost:3000 with HTTP range support
(required for video seeking)."""
import os
import sys
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import unquote, urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 3000

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('video/mp4', '.mp4')
mimetypes.add_type('video/webm', '.webm')


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def do_GET(self):
        path = urlparse(self.path).path
        rel = unquote(path.lstrip('/')) or 'index.html'
        file_path = os.path.normpath(os.path.join(ROOT, rel))
        if not file_path.startswith(ROOT):
            self.send_error(403)
            return
        if not os.path.isfile(file_path):
            self.send_error(404, 'Not found')
            return

        size = os.path.getsize(file_path)
        ctype, _ = mimetypes.guess_type(file_path)
        ctype = ctype or 'application/octet-stream'
        rng = self.headers.get('Range')

        no_cache = ('Cache-Control', 'no-store, must-revalidate')

        if rng and rng.startswith('bytes='):
            try:
                s, e = rng[6:].split('-', 1)
                start = int(s) if s else 0
                end = int(e) if e else size - 1
            except ValueError:
                self.send_error(416)
                return
            end = min(end, size - 1)
            length = end - start + 1
            self.send_response(206)
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Length', str(length))
            self.send_header('Content-Type', ctype)
            self.send_header(*no_cache)
            self.end_headers()
            with open(file_path, 'rb') as f:
                f.seek(start)
                remaining = length
                while remaining > 0:
                    chunk = f.read(min(64 * 1024, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
        else:
            self.send_response(200)
            self.send_header('Content-Length', str(size))
            self.send_header('Content-Type', ctype)
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header(*no_cache)
            self.end_headers()
            with open(file_path, 'rb') as f:
                while True:
                    chunk = f.read(64 * 1024)
                    if not chunk:
                        break
                    self.wfile.write(chunk)


if __name__ == '__main__':
    print(f'Rylo Health serving at http://localhost:{PORT}')
    HTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
