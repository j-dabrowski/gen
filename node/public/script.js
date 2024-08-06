async function fetchIPFSImages() {
    try {
      const response = await fetch('/ipfs-images');
      const images = await response.json();
      const container = document.getElementById('imageContainer');
  
      images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = `http://${image.cid}.ipfs.localhost:8080/`; //`https://ipfs.io/ipfs/${image.cid}`;
        imgElement.alt = image.description;
        imgElement.width = 40;
  
        const descElement = document.createElement('p');
        descElement.textContent = image.description;
  
        const itemDiv = document.createElement('div');
        itemDiv.className = 'image-item';
        itemDiv.appendChild(imgElement);
        itemDiv.appendChild(descElement);
  
        container.appendChild(itemDiv);
      });
    } catch (error) {
      console.error('Error fetching IPFS images:', error);
    }
  }
  
  fetchIPFSImages();