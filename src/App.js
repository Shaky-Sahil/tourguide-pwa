import './App.css';
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react';

import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import axios from 'axios';
import { Icon } from 'leaflet';

function App() {
  const MAPTILER_ACCESS_TOKEN = 'OZ4HFDYGoEnutXVI68gC'
  const MAP_ID = 'streets'


function mapTiler (x, y, z, dpr) {
  return `https://api.maptiler.com/maps/${MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${MAPTILER_ACCESS_TOKEN}`
}

const [coordinates,setCoordinates] = useState([8.5241,76.9366])
const [locations,setLocations] = useState([])
const screenWidth = window.innerWidth
const successCallback = (position) => {
  console.log(position);
  console.log(`coords are : ${position.coords.latitude}, ${position.coords.longitude}`)
  setCoordinates([position.coords.latitude,position.coords.longitude])
  
};


const errorCallback = (error) => {
  console.log(error);
};

useEffect(()=>{
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  axios.get('http://localhost:5000/').then((res)=>{
    res.data.map((r)=>{
    //setLocations(locations.concat([[r.lat,r.lon]]))
    //setLocations([...locations,[r.lat,r.lon]])
    setLocations((prevState) => ([ ...prevState, [r.lat,r.lon] ]));
    console.log(locations)

    })
  })    
},[])

const geoCode = () => {
  axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates[0]}&lon=${coordinates[1]}&limit=5&appid=5f10c8113950900a1e86a3a4b4d2b909`).then(
    (res)=>{
      console.log(res.data[0].name)
      alert(`your location is : ${res.data[0].name}`)
    }
  )
}

const getcoord = () => {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

const getChurches = () =>{
axios.get(`https://api.opentripmap.com/0.1/en/places/radius?radius=1000&lon=76.9917&lat=8.5041&kinds=foods&apikey=5ae2e3f221c38a28845f05b66fa2dcdd5a3b6a76aa69a030769545cd`)
.then((res)=>{console.log(res)})
axios.get('')
}

const customIcon = new Icon({
  iconUrl : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANMAAADuCAMAAACUPcKYAAAAkFBMVEX29vYAAAD39/f6+vqEhITr6+vw8PDz8/Pb29vv7+/j4+Pa2trm5ubW1tbe3t7s7OzKysqYmJg1NTVBQUHQ0NDAwMBnZ2cLCwu7u7s8PDxvb28bGxuenp6oqKhHR0e2trZ6enpZWVmPj48YGBhQUFAuLi6bm5uJiYlpaWklJSUvLy90dHSkpKROTk5YWFh+fn7A537GAAAYV0lEQVR4nO1dibaiuhKFiogiICggDoDgSDv9/9+9hEEBwxAG+927bvVquz16IJtKakpVhYN/H3HA/dvoP0z/DPoP0z+DhsFUdc3hn+FAfEolKgACEX48FQbBBEhQFAEQgvHM2wVmcg8CEMhL/3fM375/TAAz/XE6PUaOc/EXK54PdYGAQaKkqPOxao4HBtU/JhC8P3yBLE+eSuZlwZ+s24K/D7ym+sYESB6tipB4fvu0jmH6ZqGR6QdirzfOjqEXTGSIePUQRN76G1GR/hhEhNylgdjVAVP6ixgNkQr2LhgFjnWoh8Tzri0i7aignkB8DazjwwIYa8HRmV2bYHnTyh+d+GCgddUFUySYx/Zri9fLl1hoQKEWabAe0STjao0JD2YqaWdr2wJNQkcVRFvtX5m0xQSyd3mG9eOuooOHYP9QetcmrTDhOafeuuGJaDNHOr+Z9iwrWmKSggYiu55WGsbEb4SedWQbTGiy6QMRJh0FGJn31zEBp/XCJEKLyQu/jsReQbXBpC36goQtwSV+uU3/JqbITgvcY3+gCG3mf5dPWIZ7997mXkzXfoUEOyZpplMM705kyX8ZE+f1jAhLCiXy9f8eJrNHCZHSdWfK/Vl+rJhA6lk+JHRY3sx5T5FuVrkH50EgReR7/ch0VkxqzyIvR6uX2kdQiRXTfUBImEK7hygFGyYQ+jL0yuh0726ls2FCWkePqQHdOitgRkyXwSHx/EvqyCkmTMANKSHeZEndVBUbJqFRpKszPbROoNgw9W8W0WmhdZl+zTHhbyrLH2Hi110CLwx8Au4XEiKhLjEKBkxo8pvVFJPe3qJgmXujH0Lit05rTjFgUgZwMqpIbysnGmMC8YerKSaj5fRrjAnNfsym9uGkppiABBd/TCtnYEzS6eeY+KXaakk1wwQg6r+HxPOXVjZSQz6h/sLJLBQag2HCT8v6G5B4PmgTSW/IpwEjK5X0p80+djM+qe5fwsQ7g2Fy+o4mN6Zji8nXBFOPJsRhG57+hGHzR7SaDYRp3DlatFpfdc/UDGU2wTQzzLPf0MhvMfkaYZr6nQBtrZ0iAoopSqog/042jbi1Z598jTDNn10gXW2ZsmsBSG7EfZ99H2dwPrk2NQkR/wgZTabfwmCefM3WE1syUYZWllFq3oDYJMViZQ6DSWxrk4dO1U4tUpvMaXYh0Uw/ya/qZxluwy1lxYdetVeHvAZiIhhkPRFQpYbEyg+wkNYMzfR2I3+dHWTo1FwcpAbBtRfzPltTu1xwaAv6ZDkSyhLI2nnzXGxXq8P6Wu97N4m/+8zCvLFPyH07UKdAmxeGTbSPKBm259lKA88bmfWYXGYPvnmMZbov3kyjp4pDol6bLNQG3vOJOSbWPBaGzHz24cLovqUM43q/7MCsdBnie/kFvfVKZWzzMQDXQEswJ2IyYBr72Tv1k8sFTj0mZv+dYfqI2QUVdtpN+dzerk+n1QbEBFPv+lY/Vj951GDUR0LLJ3nZRVlmP0ydNHy06yeHFWb1WpfZOGLMJQAjMSj6mXrYQKlP9TkPiwl7PXZ0n3DST8ITzP1aTMHAmDg0i5aU21PGHYj1CuoyoIyIvg5qlPXh95QZCVy9szsaGBOHlEj4+r1lsP5lTCTBV43XdF984qBoRf6cTyAn7nZffIIGmJidQracD0gdjmNf66kBpmFlOQipHbHsrW6uPs4yoM7F3wQhSETvn56qlprIPebAEQsmonKTjKMVe9SNflGxPszGrN4ZZfk70sMedaNTvVMYDugTxl/XDi0nOeVaxMkX/DpM1mAxlvTrsyR59NIOU3qzqLZfVkwnqC2uZPcAWDEJiW9gdUjbQsDNVVO/PhYNNqK2w8SWc19P5NSypdLFE04wvFfzvdQW9SnM9l6SYP6nxf4dmXHc7Gwx1fKO2B1qdhs2ni4Hm31KgKg6zDtZW/YuBsw1KKljemfEhFfRLGizfb/yWEExY0ojcpf4FxtrbJgELRPLQlZQzKFUpMXhYItmxZZeC0S7fXJPyCj62Gu6xDiF1J18dA1RnpWFZsDpXYoiHmwWM3vIO0n1PWgochLxypdVxTAUVRbL2o/BvGPy34WphUubMH68aRiFEtFc0/fWY7lYLB/+y5PGtP0MEIOOGc8LpnTzFjWSKI6dBoiskrwk2y5fjvH1TJP4WRfaIaYYA7tKi7esLYTmZ0q0+/QqxDObxPDqyGKREm3mHqhE9K25ccnO9SLPqXwG1sG6t8hCXTO5421i+ZGBtJ1gdoX+PgiCC15SGbn2J+cdgOxnBnf0xg1CEN+PicXhaIUJZOydHjZ8eNHkMcnCHMuqZuvWImLIKp/sjsxEQBzxMnypWO4nP7CyWJeOXiVHhucTh6IkxY1K1BKXeHeIU+2oE5Cef6bp3rolvPgXh8gtvUe4uHqzT/h/7UxRZbLEgyXZt2WfD3Qm5WQofYc42Tzvk/l3VHLiHCVmq4aCZ1yqCpyqGcI7tPFnc1eIYptWhJCs4TFFdbppMgbIZvDIencnM/vNcexauFM0IbuYsZVIzA7Z0DSN6OpxPGDklc++19Byj4tNWSt2C0H8Cmfd5M9jBSGW9y+xaD0leXzvH1dNPqa4Zdt0AKSFjzjGB9GuwCEV0K7+OEuZwmGQ46d/rps9MK6Ye0z7n20xwXizTDCRPO0/nhezYyShae6SIMSrrLb2ApnlbNoyhRNbp20gJ8YEApHrtjg+4yG5O6F4QZgnmGpGVWltLGc/wQSyFXkbeBIergpZFlNhLtIM2HhW3qvvU50jyFZd2CG9xlFjTC8vDu3Qe3UAF7u3QfXFUGVSQc0vf92yLSaQYrknjitXP0Bsum+qrBv8NKri5iuTqb6mj56C1V9D8TpZVAcEK6uZ12wxvq6pXfW/jRL1VbU9gYzKiNKIcTez/dwrfVMYb7L49fL5U1NSepoMHGNhJpSkfj0FKMFel5Q9Yuz98QNMyfbOoVTr1rCJOWt+eEygJlshz7KIVk3C24u1RcsPMM1TG7dsJwl2lVNvyPy9tvTOpdzSMyZhXrmny15Y8wtMk3S5bL71DJAFVzX1TuxZdb/oM4/efKCl2QBUpRO06Qv5E0ybzwi/bxdH1sog6S1ao/0E0ycOeLK/hggV7q3rDVif24my5f/H4pKq6IgSXhgNiPclfzn3+G+BHvmUVDp4LRvSD4bpc9l8L7hFwZYtz1z223ZkGZRPkW+PxrnJVRRk5ZJ82bbSYOi5B9ykYKDq+S+g8u53bXPPhpt78ZaocH8URlrEVF7WZ/5/YQJuLkwFSaNkD+wKXywvBGBOsHxfcyA+Bcf9hrbVHuZNUpiVQuL3TdVtcpLV++1QmBTTUBxKFs41vzk1r2gEteHe5eRUJO/o9AfYsJii26l+YZjL18eJgrqo3tFxPM/UFFX4irXHGMaSYTvBzX8s12v3uNE+YIfBFN+20CDXyhdOAjh1aROrbbh+XEfOhMts6Ef8mWrn/XOR3QrxpYH5lNxd2r9HvfULJ9WA2Lxz82F5VsbpJONk4+5/W76pfza0fkJj7UZW1cEd2UL+SQNjS5Q/IzU6lWhq6j5VT/8KEykEUzXbVKRsLB2vBNObIJWxR+FrDGMlKD0tIt39+IWfm5VO8U+iDlB7UBizChbezq/4+IeYKCijsMsFaSv+MWLoSb2qfgbhX8SUZN47yF7bgOa9tQb+e3wCJHjROtKQ5hEt01snsr+BKTFhFD+S4KEAIrYpQKzuTcFAv557BMx4Pp8Kip4sik08ANTfyRah8gtM7y0qNMZgLN+3/Ldd68Xpa6iPc29iOv0EU4psbj6KWjKJnoPSGySM6Tc6lygnzrG+hbAe3xf12KtwMRuYT7GfS0znu0+5f1LoBvV1NZW0yrJ/PRuWT1NZlmaad349PpZz6G7eBp4TW0pdm7y/shp7OekV09dlVM10gtfVPz6OT9/a7IOdpymykc7BNOGhm3I66LOs1+mq/WJC8/zOVzzziJEnvhu0IMVP754EWJuU8FdAuoOWff/oERMe/GR3pW4upcezRt/6JCEGyczrxiZdRLnduGdvPiGgqbnHlsG55ltyJrf3JhPWwaxTV+qdWGgdmpZKdc6PQKK2ryvrxwCmppXxaQ9+4NlOUAz9MRF2pgptb3rCBKLxPg2TnmNHFtZccdwvL71ji0xyZAXKb26nR2N1wgRIvXwm1JKWqQKiZO42/fc1jqRMYTmmPadb5yRypFjDyQUUNpSDMYxXxio6LPaOaV56aGJ6IOVDxW2e17gLpsRUK9YLX79be4mS5uij22az2V8cQ4i8+Ht3UFF/X1Tw/dOWS+1zEpH3HfUZCUVORWpKnM6F+ZhLAo8gdDbFY01UrG25dMQEMlUO+9Tu3JDPV0Rqm1NcM7SK8wuKWyLB53ZtICG5pOji2uQEJ1SduFJLt4ghIBYmyhm6YAKptPTen9Uf94ZmnTqHH2P7G2YFn0zvMvdgUtFNwN3VFpV1PFvATlyvYm5mmvLCXstKGkFWN0hY1GU9oQbd3MrpxpW5k0FrnxBmfsndVgsXOxaWr1cnAYDSxWk6JmII3n3mDlYQvIihso/Xcou6z2kZlzaeMZFkQRCmpWgiZ770mTShg51e610LsZOxHpw4S4yJa4UJpiXG9OoixhUlJWnm8T8gTtrU3n3onMrVFNPqzKFoy1AIWs494KhNVbFjvqvLOiGu4VwLup239CnfRkZ8pXczBhi3tMvT0vAibc2anHjMIUG5HzueMRfa77ukgiaTcdBOP8GE/piPWomqjX14cT7THIZGGKW0/0yGpKaP0lyfMRt9TF9MrsKlbC/8wlQxNG/3stx+DgFU4MONeD+EkkTBhqnEqLnJZdkZMHZ6PPP0kGlaAVxUp0jrFcrUsylpvlekUUU5Bfav9d4OsnhkM5Bia+9ISUpi6lU3pxmuy+pcSAGb8A5lk7wNvTKiFcaRfbWnSFsmTB5lu3td3f0aTI9DSDSCTkcKJGRn7pTUv+2ourAhJqBbnuu33UgnNHneRbJBLXm3rsxaZ93ouJ6U2lmfYT3l6tYTWtb0KMeC3OEv2PslCldybi2dwdjZz6Wdgkx+GNJy/Bj4RDmH52RWcglg7AnTI/+KXXr8Vtu1iektIgszzJ3HAxLBRG1u3hgTohSKrM203D028r60EzK3OjFZ/eQAT8yssRZ8x/qqaWtH8SES6srICJX8jFpf3bjPPMWACAkkPExxim1xgVLziSY+NtDI68lJEnMI+Il3Y9LAF4m4xYXT1eLEP2qctCEmoBxaEnoEknHZPN31erl8OlLhWtFZE1sPIRXPnaf5rqUENFWcjVvfo2W1IZPOVaM+u6fMJkN0Y744HRkxUU69WxG9lGsU/7gX8g0jdbaUAEn4f4eX9vZCiA0o1cYkTvcxmfBOHPMqtA4GcpQAtclSQ0zI+A537yLzNJ8dPpIyqV8o8UoC0giT+DqnkQHv54q04hWLFJoimm74kxQ76X5Wu0JsluvUwTfCBNKXxjyQszNmc7FgALr2OJEYINrJ5CLnxqLpOXoqo8TYxSjrmj76pA0Fmm11iOsIbnlzBS6ljeGbYAJu98WmQASkPK77ohoOX6YkCHNB0kZvFesQN1SMUyqX9znxhhGcM5fcWpfAKtwiCXhxHl4y0RPNt5IGbk8p/miOCRlfYmojAE1sEFqFYXjKHfUSzXoA5Rb9bKkbkqp9QqgHLFwwc8V8muk79okHGB8YkW8kByQqUnLKaQNM8N2X1lUgal/SjFaRdMLSLtkGCV33o+tcLzodCl8vWxBw/dgH6Wkldp5P8jO5bitM3FdPka2Bh6A075cVpI9c1nPMOCxdXUp3BrLu5k3+jCs9zW3yhelaEgGpx4SMotBd7fCKkBg2JxbqW4ZL92sC62AF2vyjs8YZbRFkt0eSXaa8ARvNvbKyvFpM8F1Q4U6gNCJGp93nqYOgeMHRdWxNiBoIpXfxPms238Utqe99Fbw00N2yGpU6TMB9x4Hv0R7dmaFX21p59zCLkiVEWdWc13Nxe2fTfLTVwcnHB+Ow+GOWYxNhbGlTgDpMaRQtQ2GUhgDcncFoy59TgBxrGT+RSAnhP957fh92BYagaEbYXJEqWgJUY6I0+iEJG0SljlWGBMltVpNA5nC4NSmafHc8Ju+Lc0wkDzVfjpIMuiWfKK3zFgo5ucoLbmsWlyFTIZR2j4zpgM3Gz/75shgnBCBmWX77EaTqEEgFJqIo598WzGss3Y8n1m1mP1N7Msn5haHDvfUC5ZQ8uJMgb45Lwv5UuRtUiinm7vfhpatRq0aOmTJCZBcuep4iE8NcPc4cJVh3wZ5TlnkRm+kGeR2m6EOZEu1pmQjwaWzx1YaAiIWJc/ZUyowC8bbK7y5E55VVnlpYhanXQ6jfOpPWLp9st5S4/+oyf0YEKJGBtW+JqbphACulCwrGlLisMy4ZCGhuzlxIO9o9KqRElYwQO6WiFSkNHaQNxHK0LTt4GqaSCJ9RQnpS3qKiDW4Fpqy50gO90jtK1BUZlKz6vCAEKZGZVSeKl2MCud/jz59p1taE+vGholHEx1h81x8eKop3y2V5fwc2x5QWukcBHwoF5SOcTpP/oTQeUNkroxRTdVOyFpQW5kJJcKUME6mkTE1d8b2Z1YZPlV0LqYRXSaWYTGOOZZ2Kg9IZYy5TTJ/MlXULGcHcI/mpv4JqOZkUun+l1OQ/Lo4PockxivTjkUr+5wmw6iegRb+qaGvtDEXzquP7o9gcKGtEQMUEonb3+VPs/WUak66rOqrRMMHbflncdL2g9cMjZYb5d8VZ1inoJAUXSkqnaZhgGgmqGFP2bJsd5cvVfMJsinT9zZxpRj5DdOFo+U3n/YPHT++i1Av+NFm7xO36wkQebcyZWMFmFNu6MvWMjineX79LzpI/ajo/ctxnHIF0bcf5yMPVYrWfYVbyrtHAP3TjkZWdunPmvqy9VFBFB5QAfCbttdLro6+nOV4Z6zNH+q1ZxiVQDPMeI/HMd4Xs4vbU7wtP1TAj7+aCpx1InaN1nMRaxlHKzmzai/QxJu8yU29U2VmCjkk7vkxlLPtbK9A0beZcbttIWI9mtsVbnufyq5eJP7isHE1zVkdjxC9HdZZUtCrKskaixqRfRnniklrRm0xy5r2y7TwdkyBjEwYp4R/P269NPKnD52oz2h41zedf2sW+4NfX2jYXf/S1c105irs6j3Y1SnpLysjKGxB/t+cDmMYCah9N2kzotLqtL13ukd4MGpItPgzx6J+86418Q8dMcfHSCXx7fdRevKXs+eBoeSddUUbOZmPXYDqQgFh52T6l5SBM4+lGlFGu1UT1wTKldsT0PlON14F3tQu/9bTQ0RZLZYOtAcW5u2tbC13N8AOfdwxvf1fs+iPEyHll5TOvuLUZDyI5gt2JAooZ2VKdnFoiy0ENToGqYk7oyom/KpujceHvxpF/zYx9aDmm4piTiU32FjyLX1uNbEMDVRiRK8p8Sp2lqJAhW0NTffRxEVMcjpQNO1jxN2NiHo07v9a80NPcwJjpuu5NNNtZPG3Pt0aMSRyYT+W17YdvTO8udmT/IrdVWX1QE4VPwHl3RTljMbabGPvZaOlMPH3inf1AVUaHJbYs8Edhi+CRUbXfSTl8KfXgDsQQypqJq+oeuF+YAKTL0p5E0fDXzLyohudoxkzR19iq65bhZUwqjEgapmQvL9oWyW53naqPsf+ae6L54J8zJVLgl8l97ej383GvtDg/okgrs6qrAuXcNEgOeIi2OFFmBG51J7ECJjQmc+6pzMgVTrZy5Q8L82lpxTBjK0x+1acUTKkuiwKUKPPbPgsmUCOBuT1PTH9paRG3traidTrpqBlRDnlKs3hJjh5ARuzt6/aXMp8jKZkdp51iaIoXa4Tl9dEDl9gxQYrpErWZyGiBUSWkHKZMLdtq7fu/QJLB9J3rkHqPpAYoFxWsOVE3gylxwP4SVWAiFgZIGZeTARMtNfRnRFtPMabIwoBJRiHWnCT+wYQmPQe/2Igm9+IAQqS5IJu6sK+ElIlEQ6/RcWaiYYr5FHEwh8mv2bB9YzLbbJX1RxQ7IuFTVH4GSvZAnOqjKVJMINcezjssUezyFJNB1FMWU0O7HKRg1IH2tz2mzWZz21yt62Zj+ZZl+U/f95/H4/N5fDwex4dLaLlc4pd1RIvFInqJ6P49Nhm7ouvQVWJXY7FePvzr/nJ2vIY2bNq3ojNFSR2fyi4xojH5OyUkCMJ8LsgRSZKE/6qY8ItMGRxCoqRoscUqqbIwTobJYEd0oXfi0PsdRGmr8d8mVHLZT74pxBf7CpkNhun/iP7D9M+g/zD9M+jfh4hQQ0n7T6L/AROZmjZvWbXSAAAAAElFTkSuQmCC',
  iconSize :[38,38]
})


  return (
    <div className="App">
      Mini project
      <div className='map-cont'>
      <MapContainer center={coordinates} zoom={12} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //url={`https://api.maptiler.com/maps/${MAP_ID}/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`}
    url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  />
  <Marker position={[8.5041, 76.9917]} icon={customIcon}>
  <Popup>
        Never gonna give you up. <br /> Never gonna let you down.
      </Popup>
  </Marker>
 
</MapContainer>
    </div>
    </div>
  );
}

export default App;
