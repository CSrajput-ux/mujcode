import requests
import json

try:
    # Test the courses API endpoint
    response = requests.get('http://localhost:5000/api/student/courses/247030521')
    
    print(f"Status Code: {response.status_code}")
    print(f"\nResponse Data:")
    
    data = response.json()
    print(json.dumps(data, indent=2))
    
    if 'courses' in data:
        print(f"\n\n=== SUMMARY ===")
        print(f"Total courses: {len(data['courses'])}")
        print(f"\nCourse Progress:")
        for course in data['courses']:
            print(f"  - {course['title']}: {course['progress']}% (Status: {course['status']})")
            
except Exception as e:
    print(f"Error: {e}")
