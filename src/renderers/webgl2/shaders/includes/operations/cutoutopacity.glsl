void cutoutOpacity( float alpha, float cutoutThreshold ) {
	if ( alpha < cutoutThreshold ) discard;
}
