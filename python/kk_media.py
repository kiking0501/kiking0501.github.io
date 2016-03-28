import webbrowser

class Movie():
    """ This class provides a way to store movie related information"""
    
    def __init__(self, movie_title, movie_image, trailer_youtube):
        self.title = movie_title
        self.poster_image_url = movie_image
        self.trailer_youtube_url = trailer_youtube

    def show_trailor(self):
        webbrowser.open(self.trailer_youtube_url)
        
class Image():
    """ This class provides a way to store image related information"""

    def __init__(self, image_title, image_image, image_origin_url):
        self.title = image_title
        self.poster_image_url = image_image
        self.origin_url = image_origin_url
