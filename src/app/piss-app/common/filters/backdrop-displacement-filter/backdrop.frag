varying vec2 vTextureCoord;

uniform vec2 scale;

uniform sampler2D uSampler;
uniform sampler2D backdropSampler;

uniform highp vec4 inputSize;
uniform vec4 inputClamp;

void main(void)
{
  vec4 map =  texture2D(uSampler, vTextureCoord);

  map -= 0.5;
  map.xy *= scale * inputSize.zw;

  vec2 dis = clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw);
  gl_FragColor = texture2D(backdropSampler, dis);
}