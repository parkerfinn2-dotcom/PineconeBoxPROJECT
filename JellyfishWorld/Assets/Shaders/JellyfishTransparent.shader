Shader "Custom/JellyfishTransparent"
{
    Properties
    {
        _Color ("Color", Color) = (0.6, 0.8, 1.0, 0.7)
        _Opacity ("Opacity", Range(0, 1)) = 0.8
        _EmissionStrength ("Emission Strength", Range(0, 5)) = 1.0
        _RimPower ("Rim Power", Range(0.5, 10)) = 3.0
        _RimColor ("Rim Color", Color) = (1.0, 1.0, 1.0, 1.0)
    }
    SubShader
    {
        Tags { "Queue"="Transparent" "RenderType"="Transparent" }
        LOD 100

        Pass
        {
            ZWrite Off
            Blend SrcAlpha OneMinusSrcAlpha
            Cull Off

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
            };

            struct v2f
            {
                float4 vertex : SV_POSITION;
                float3 normal : NORMAL;
                float3 viewDir : TEXCOORD0;
            };

            float4 _Color;
            float _Opacity;
            float _EmissionStrength;
            float _RimPower;
            float4 _RimColor;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.normal = UnityObjectToWorldNormal(v.normal);
                o.viewDir = normalize(UnityWorldSpaceViewDir(UnityObjectToWorldPos(v.vertex)));
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                // Rim lighting
                float rim = 1.0 - saturate(dot(normalize(i.viewDir), normalize(i.normal)));
                float4 rimColor = _RimColor * pow(rim, _RimPower) * _EmissionStrength;

                // Base color with transparency
                float4 finalColor = _Color;
                finalColor.a = _Opacity;

                // Add emission
                finalColor.rgb += rimColor.rgb;

                return finalColor;
            }
            ENDCG
        }
    }
    FallBack "Transparent/Diffuse"
}