import numpy as np
import scipy.misc as smp
from PIL import Image

# Create a 1024x1024x3 array of 8 bit unsigned integers
#data = np.zeros( (1024,1024,3), dtype=np.uint8 )

#data[512,512] = [254,0,0]       # Makes the middle pixel red
#data[512,513] = [0,0,255]       # Makes the next pixel blue

def layer_images(images):
    result = None
    if len(images) > 0:
        for image in images:
            if result is None:
                result = image
            else:
                #result = np.add(result, image)
                result = Image.alpha_composite(result, image)
    return result

def open_image_as_array(name):
    image = Image.open(name)
    image_array = np.array(image)
    return image_array

def show_image_from_array(image_array):
    img = Image.fromarray( image_array ) # Create a PIL image
    img.show() # View in default viewer

def open_image(name):
    image = Image.open(name)
    return image

def show_image(image):
    image.show() # View in default viewer


image_names = [ 'pixil-frame-0(8).png', 'pixil-frame-0(10).png', ]
#images = [open_image_as_array(image_name) for image_name in image_names]
images = [open_image(image_name) for image_name in image_names]

for image in images:
    show_image(image)
result = layer_images(images)
show_image(result)