
from django.urls import path
from .views import SummaryView, InsightView, SearchView, ChatView, ResearchReadinessView

urlpatterns = [
    path('summarize/', SummaryView.as_view(), name='summarize'),
    path('insights/', InsightView.as_view(), name='insights'),
    path('search/', SearchView.as_view(), name='search'),
    path('chat/', ChatView.as_view(), name='chat'),
    path('research-readiness/', ResearchReadinessView.as_view(), name='research-readiness'),
]
