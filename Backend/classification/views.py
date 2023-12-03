from rest_framework.decorators import api_view
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt

import numpy as np
from keras.models import load_model
from keras.optimizers import Adam
from keras.preprocessing.image import img_to_array
from keras.preprocessing.image import load_img
from keras.applications.mobilenet import preprocess_input
from .models import ImageModel
import os

def runModel(path):
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    script_directory = os.path.dirname(os.path.abspath(__file__))
    print("Model Paht", script_directory)
    model_path = os.path.join(script_directory, './hack_mobilenet.h5')
    size=(224, 224)
    model = load_model(model_path)
    model.compile(loss='categorical_crossentropy', optimizer=Adam(learning_rate=1e-5),
             metrics=['accuracy'])
    waste_types = ['cardboard','glass','metal','paper','plastic','trash']
    img = load_img(path, target_size=size)
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)
    preds = model.predict(img)[0]
    i = np.argmax(preds)
    label = waste_types[i]
    return label

@csrf_exempt
@api_view(['POST'])
def classify(request):
    try:
        file = request.FILES['file']
        image_model = ImageModel.objects.create(image_file=file)
        image_model.save()
        image_path = image_model.image_file.url
        new_path = "."+image_path
        print("New Path", image_path)
        image_label = runModel(new_path)
        print(image_label)

        success_response = {
            'result': 'success',
            'message': 'File uploaded successfully',
            'image_label': image_label,
        }
        response = JsonResponse(success_response)
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        file_response = FileResponse(file.open(), content_type='image/jpeg')  # Adjust content_type as needed
        response.streaming_content = file_response.streaming_content
        return response
    except Exception as e:
        print(e)
        error_response = {
            'result': 'error',
            'message': str(e),
        }
        return JsonResponse(error_response, status=500)
