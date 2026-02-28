self.addEventListener("install",e=>{ 
   e.waitUntil( 
     caches.open("warm").then(c=>c.addAll(["./"])) 
   ); 
 });