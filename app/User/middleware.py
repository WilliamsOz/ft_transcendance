from django.shortcuts import redirect

# middleware.py
from django.urls import resolve

class CheckConsentMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print(f"Current path: {request.path}")
        if request.user.is_authenticated and not request.user.consent_given:
            if request.path not in ["/consent/", "/logout/"]:
                print("Redirecting to consent")
                return redirect('consent', id=request.user.id)
        response = self.get_response(request)
        return response
