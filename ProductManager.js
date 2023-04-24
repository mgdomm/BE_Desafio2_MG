const fs = require('fs');


//se define clase ProductManager
//tiene constructor con propiedad "path" y valor de la ruta
class ProductManager{
    constructor(){
        this.path = './products.json';
        this.maxId = 0;
        if (fs.existsSync(this.path)) {
            const productsFile = fs.readFileSync(this.path, 'utf8');
            const products = JSON.parse(productsFile);
            if (products.length > 0) {
                this.maxId = products[products.length - 1].id + 1;
            }
        }
    }
    
    
    //se define metodo "createUser" aue acepta el parametro "user"
    //la palabra clave "async" indica que el metodo "createUser" es una funcion asincrona
    //se usa el bloque try/catch para manejo de errores
    async addProduct(product){
        try {
            product.id = this.maxId++;
            const productsFile = await this.getProducts();
            productsFile.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        } catch (error) {
            console.log(error);
        }
    }
    
    async getProductById(id){
        try {
            if (fs.existsSync(this.path)){
                const products = await this.getProducts();
                const product = products.find(p => p.id === id);
                return product;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);  
        }
    }

    async updateProduct(id, updatedFields) {
        try {
          const productsFile = await this.getProducts();
          const productIndex = productsFile.findIndex((p) => p.id === id);
          if (productIndex === -1) {
            console.log(`No existe este ID: ${id}.`);
            return;
          }
          const updatedProduct = { ...productsFile[productIndex], ...updatedFields };
          productsFile[productIndex] = updatedProduct;
          await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        } catch (error) {
            console.log(error);
        }
    }
    
      async deleteProduct(id) {
        try {
          const productsFile = await this.getProducts();
          const productIndex = productsFile.findIndex((p) => p.id === id);
          if (productIndex === -1) {
            console.log(`No existe este id: ${id}.`);
            return;
          }
          productsFile.splice(productIndex, 1);
          await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        } catch (error) {
          console.log(error);
        }
      }
    
      
      async getProducts(){
        try {
            if (fs.existsSync(this.path)){
                const products = await fs.promises.readFile(this.path, 'utf8');
                const productsJS = JSON.parse(products);
                return productsJS;
            } else {
                return []
            }
        } catch (error) {
          console.log(error);  
        }
    }

}

//instanciamos la clase
const manager = new ProductManager();

const product1 = {
    title:'Coca Cola',
    description:'Refresco',
    price: 2,
    thumbnail:'imagen',
    code: 10,
    stock: 250,
}
const product2 = {
    title:'Fanta Naranja',
    description:'Refresco',
    price: 2,
    thumbnail:'imagen',
    code: 20,
    stock: 370,
}

const test = async() => {
    const get = await manager.getProducts();
    console.log('primera consulta', get);

    await manager.addProduct(product1);
    const get2 = await manager.getProducts();
    console.log('segunda consulta', get2);
    
    await manager.addProduct(product2);
    const get3 = await manager.getProducts();
    console.log('tercera consulta', get3);
    
    const productById = await manager.getProductById(1);
    console.log('producto con id 1', productById);
    
    const productToUpdate = { title: 'Agua', description: 'Bebida' };
    await manager.updateProduct(1, productToUpdate);

    const updatedProduct = await manager.getProductById(1);
    console.log('Producto Actualizado:', updatedProduct);

    await manager.deleteProduct(0);
    const get4 = await manager.getProducts();
    console.log('cuarta consulta', get4);
}

test()