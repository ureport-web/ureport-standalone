#!/usr/bin/env node
/**
 * 
 * scenarios for reurns:
 *  pass
 *  fail 
 *  SKIP
 * fail - pass
 * fail - fail
 * fail - skip
 * skip - pass
 * skip - fail
 * skip - skip
 * pass - pass
 * pass - fail
 * pass - skip
 * fail - pass - skip
 * fail - pass - fail
 * fail - pass - pass
 * skip - pass - skip
 * skip - pass - fail
 * skip - pass - pass
 * pass - pass - skip
 * pass - pass - fail
 * pass - pass - pass
 */

var moment = require('moment')
var batchTests = [{
    build: "6156f5ad744820091c9305b1",
  'uid': '165420',
  'name': 'test some basic function 20',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'PASS',
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
}, {
    build: "6156f5ad744820091c9305b1",
  'uid': '165424',
  'name': 'test some basic function 24',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},{
    build: "6156f5ad744820091c9305b1",
  'uid': '165423',
  'name': 'test some basic function 23',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
    {
        build: "6156f5ad744820091c9305b0",
      'uid': '165420',
      'name': 'test some basic function 20',
      'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
      'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
      'status': 'PASS',
      'is_rerun': false,
      'info': {
        'description': 'this is the very first basic test',
        'group': 'Integration;Smoke Test'
      }
    }, {
        build: "6156f5ad744820091c9305b0",
      'uid': '165424',
      'name': 'test some basic function 24',
      'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
      'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
      'status': 'FAIL',
      'failure': {
        'reason': 'java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[]}'
      },
      'is_rerun': false,
      'info': {
        'description': 'this is the very first basic test',
        'group': 'Integration;Smoke Test'
      }
    },{
        build: "6156f5ad744820091c9305b0",
      'uid': '165423',
      'name': 'test some basic function 23',
      'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
      'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
      'status': 'SKIP',
      'failure': {
        'reason': 'java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[]}'
      },
      'is_rerun': false,
      'info': {
        'description': 'this is the very first basic test',
        'group': 'Integration;Smoke Test'
      }
    },
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165425',
  'name': 'test some basic function 1',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
  build: "6156f5ad744820091c9305b0",
  'uid': '165425',
  'name': 'test some basic function 1',
  'start_time': moment().subtract(1, 'days').add(3,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(3,"hour").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165426',
  'name': 'test some basic function 2',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'FAIL',
  'is_rerun': false,
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165426',
  'name': 'test some basic function 2',
  'start_time': moment().subtract(1, 'days').add(2,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(2,"hour").format(),
  'status': 'FAIL',
  'is_rerun': true,
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165427',
  'name': 'test some basic function 3',
  'start_time': moment().subtract(2, 'days').format(),
  'end_time': moment().subtract(2, 'days').format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165427',
  'name': 'test some basic function 3',
  'start_time': moment().subtract(1, 'days').format(),
  'end_time': moment().subtract(1, 'days').format(),
  'status': 'SKIP',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
  build: "6156f5ad744820091c9305b0",
  'uid': '165428',
  'name': 'test some basic function 28',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
  build: "6156f5ad744820091c9305b0",
  'uid': '165428',
  'name': 'test some basic function 28',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(3,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(3, "minute").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165429',
  'name': 'test some basic function 29',
  'start_time': moment().subtract(2, 'days').format(),
  'end_time': moment().subtract(2, 'days').format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},{
    build: "6156f5ad744820091c9305b0",
  'uid': '165429',
  'name': 'test some basic function 29',
  'start_time': moment().subtract(1, 'days').format(),
  'end_time': moment().subtract(1, 'days').format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165430',
  'name': 'test some basic function 30',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(3,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(3,"minute").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165430',
  'name': 'test some basic function 31',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(13,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(13,"minute").format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165432',
  'name': 'test some basic function 32',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(13,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(13,"minute").format(),
  'status': 'PASS',
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165432',
  'name': 'test some basic function 32',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(15,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(15,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165433',
  'name': 'test some basic function 33',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165433',
  'name': 'test some basic function 33',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165433',
  'name': 'test some basic function 33',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165434',
  'name': 'test some basic function 34',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165434',
  'name': 'test some basic function 34',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165434',
  'name': 'test some basic function 34',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'FAIL',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165435',
  'name': 'test some basic function 35',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165435',
  'name': 'test some basic function 35',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165435',
  'name': 'test some basic function 35',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'SKIP',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165436',
  'name': 'test some basic function 36',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'PASS',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165436',
  'name': 'test some basic function 36',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165436',
  'name': 'test some basic function 36',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165437',
  'name': 'test some basic function 37',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'PASS',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165437',
  'name': 'test some basic function 37',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165437',
  'name': 'test some basic function 37',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165438',
  'name': 'test some basic function 38',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165438',
  'name': 'test some basic function 38',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165438',
  'name': 'test some basic function 38',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165439',
  'name': 'test some basic function 39',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165439',
  'name': 'test some basic function 39',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165439',
  'name': 'test some basic function 39',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165440',
  'name': 'test some basic function 40',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165440',
  'name': 'test some basic function 40',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165440',
  'name': 'test some basic function 40',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},

{
    build: "6156f5ad744820091c9305b0",
  'uid': '165441',
  'name': 'test some basic function 41',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'PASS',
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},

{
    build: "6156f5ad744820091c9305b0",
  'uid': '165441',
  'name': 'test some basic function 41',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(6,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(6,"minute").format(),
  'status': 'FAIL',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    },
    'failure': {
        'reason': 'java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[]}'
      },
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165442',
  'name': 'test some basic function 42',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'PASS',
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},

{
    build: "6156f5ad744820091c9305b0",
  'uid': '165442',
  'name': 'test some basic function 42',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(15,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(15,"minute").format(),
  'status': 'SKIP',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    },
    'failure': {
        'reason': 'java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[]}'
      },
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165443',
  'name': 'test some basic function 43',
  'start_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").format(),
  'status': 'PASS',
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165443',
  'name': 'test some basic function 43',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(1,"minute").format(),
  'status': 'PASS',
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
},
{
    build: "6156f5ad744820091c9305b0",
  'uid': '165443',
  'name': 'test some basic function 43',
  'start_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'end_time': moment().subtract(1, 'days').add(1,"hour").add(5,"minute").format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [434] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': true,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
    }
}]
module.exports = batchTests
