import logging
import urllib
import webapp2

from google.appengine.api import urlfetch
from google.appengine import runtime

class MainPage(webapp2.RequestHandler):
  def get(self):
    method = self.request.get('method')
    if method: method = method.upper()
    if method not in ('POST', 'DELETE', 'PUT'):
      method = 'GET'

    path = self.request.path
    args = self.request.arguments()
    params = [(i, self.request.get(i)) for i in args if i != 'method']
    encodedParams = urllib.urlencode(params)
    
    baseUrl = 'http://test-notifications.staging.waze.com'
    fullUrl = baseUrl + path

    if method == 'GET' and encodedParams:
      fullUrl += '?' + encodedParams

    urlfetchMethod = urlfetch.__dict__[method]
    try:
      resp = urlfetch.fetch(url=fullUrl,
                            payload=encodedParams,
                            headers={'Content-Type': 'application/x-www-form-urlencoded'},
                            method=urlfetchMethod,
                            deadline=45)

    except runtime.DeadlineExceededError:
      logging.error('Deadline exceeded.')

    if resp.status_code >= 200 and resp.status_code < 300:
      self.response.headers['Content-Type'] = 'application/json'
      self.response.write(resp.content)
    else:
      self.error(404)


app = webapp2.WSGIApplication([
    ('/.*', MainPage),
], debug=True)
