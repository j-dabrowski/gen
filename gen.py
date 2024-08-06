import numpy as np
import scipy.misc as smp
from PIL import Image
import argparse
import os

# Create a 1024x1024x3 array of 8 bit unsigned integers
#data = np.zeros( (1024,1024,3), dtype=np.uint8 )

#data[512,512] = [254,0,0]       # Makes the middle pixel red
#data[512,513] = [0,0,255]       # Makes the next pixel blue

#python3 gen.py --0 0.png --1 0.png

parser = argparse.ArgumentParser()
parser.add_argument("--vs", dest="view_scale", help="view scale", metavar="VIEW SCALE")
parser.add_argument("--0", dest="img_zero", help="image zero", metavar="IMAGE ZERO")
parser.add_argument("--1", dest="img_one", help="image one", metavar="IMAGE ONE")

args = parser.parse_args()

print("Using Details:")
print(args)

cwd = os.getcwd()

def adjust_hue(original_image, delta_hue):
    # Split the image into RGB and alpha channels
    rgb_image = original_image.convert('RGBA')
    r, g, b, a = rgb_image.split()
    # Convert the RGB channels to HSV
    h, s, v = Image.merge('RGB', (r, g, b)).convert('HSV').split()
    # Adjust the hue channel
    h = h.point(lambda i: (i + delta_hue) % 256)
    # Merge the channels back together
    adjusted_image_rgb = Image.merge('HSV', (h, s, v)).convert('RGB')
    # Combine the adjusted RGB channels with the original alpha channel
    adjusted_image = Image.merge('RGBA', (adjusted_image_rgb.split() + (a,)))
    return adjusted_image

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

def open_image_as_array(image):
    image_array = np.array(image)
    return image_array

def show_image_from_array(image_array, scale=1):
    img = Image.fromarray( image_array ) # Create a PIL image
    show_image(img, scale) # View in default viewer

def open_image(name):
    image = Image.open(name)
    return image

def show_image(image, scale=1):
    if(scale == 1):
        image.show() # View in default viewer
    else:
        scaled_img = image.resize((image.width*scale, image.height*scale), resample=0) 
        scaled_img.show()

def save_image(image, image_name, i):
    filename_parts = os.path.splitext(image_name)
    print(filename_parts)
    output_path = os.path.join(cwd, (filename_parts[0] + "_" + str(i) + filename_parts[1]))
    print(output_path)
    image.save(output_path)

image_names = [ args.img_zero, args.img_one, ]
images = [open_image(image_name) for image_name in image_names]

if (args.view_scale):
    viewScale = int(args.view_scale)
else:
    viewScale = 1

#for image in images:
    #show_image(image, viewScale)
#result = layer_images(images)
#show_image(result, viewScale)

#img_array = open_image_as_array(args.img_zero)
#show_image_from_array(img_array, viewScale)
#print(len(img_array))
#for i in range(0, 18):
#    print(img_array[i])
#adjusted_hue_image = adjust_hue(images[0], -70)
#adjusted_hue_image_array = open_image_as_array(adjusted_hue_image)
#show_image_from_array(adjusted_hue_image_array, viewScale)
#save_image(adjusted_hue_image, image_names[0])

def auto_gen_hue_images(image, image_name, scale, amount, increment_hue):
    for i in range(0,amount):
        adjusted_hue_image = adjust_hue(image, i*increment_hue)
        scaled_image = adjusted_hue_image.resize((adjusted_hue_image.width*scale, adjusted_hue_image.height*scale), resample=0) 
        save_image(scaled_image, image_name, i)

def manual_gen_hue_images(image, image_name, scale, hues):
    for i in range(0,len(hues)):
        adjusted_hue_image = adjust_hue(image, hues[i])
        scaled_image = adjusted_hue_image.resize((adjusted_hue_image.width*scale, adjusted_hue_image.height*scale), resample=0) 
        save_image(scaled_image, image_name, str(i) + "_" + str(hues[i]))

#gen_hue_images(images[0], image_names[0], 15, 16, 16)
#auto_gen_hue_images(images[0], image_names[0], 15, 8, 29)

hues = [0, 58, 87, 116, 154, 174, 180, 185, 190, 203, 211, 223, 225, 227]
manual_gen_hue_images(images[0], image_names[0], 8, hues)