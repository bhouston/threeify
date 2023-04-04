#pragma import "../tests/fragment.glsl"
#pragma import "./sphere.glsl"

void tests( inout TestSuite suite ) {
    Sphere sphere = Sphere( vec3( 0. ), 1. );
    Ray incidentRayX1 = Ray( vec3( -4., 0., 0. ), vec3( 1., 0., 0. ) );
    Ray incidentRayY1 = Ray( vec3( 0., -4., 0. ), vec3( 0., 1., 0. ) );
        Ray incidentRayY1X2 = Ray( vec3( 2., -4., 0. ), vec3( 0., 1., 0. ) );

    {
        Hit hit;
        bool isHit = raySphereIntersection( incidentRayX1, sphere, hit );
        assert( suite, 0, isHit );
        assert( suite, 1, length( hit.position -vec3( -1.,0., 0. ) ) < 0.0001 );
        assert( suite, 2, length( hit.normal -vec3( -1.,0., 0. ) ) < 0.0001 );
    }


    {
        Hit hit;
        bool isHit = raySphereIntersection( incidentRayY1, sphere, hit );
        assert( suite, 3, isHit );
        assert( suite, 4, length( hit.position -vec3( 0.,-1., 0. ) ) < 0.0001 );
        assert( suite, 5, length( hit.normal -vec3( 0.,-1., 0. ) ) < 0.0001 );
    }


    {
        Hit hit;
        bool isHit = raySphereIntersection( incidentRayY1X2, sphere, hit );
        assert( suite, 6, ! isHit );
       }

}
