# vals = """FF140c1c
# FF442434
# FF30346d
# FF4e4a4e
# FF854c30
# FF346524
# FFd04648
# FF757161
# FF597dce
# FFd27d2c
# FF8595a1
# FF6daa2c
# FFd2aa99
# FF6dc2ca
# FFdad45e
# FFdeeed6"""

# vals = """FF000000
# FF222034
# FF45283c
# FF663931
# FF8f563b
# FFdf7126
# FFd9a066
# FFeec39a
# FFfbf236
# FF99e550
# FF6abe30
# FF37946e
# FF4b692f
# FF524b24
# FF323c39
# FF3f3f74
# FF306082
# FF5b6ee1
# FF639bff
# FF5fcde4
# FFcbdbfc
# FFffffff
# FF9badb7
# FF847e87
# FF696a6a
# FF595652
# FF76428a
# FFac3232
# FFd95763
# FFd77bba
# FF8f974a
# FF8a6f30"""

# vals = """FFfbf5ef
# FFf2d3ab
# FFc69fa5
# FF8b6d9c
# FF494d7e
# FF272744"""

# vals = """FF2b0f54
# FFab1f65
# FFff4f69
# FFfff7f8
# FFff8142
# FFffda45
# FF3368dc
# FF49e7ec"""

# vals = """FF000000
# FF55415f
# FF646964
# FFd77355
# FF508cd7
# FF64b964
# FFe6c86e
# FFdcf5ff"""

# vals = """FF73464c
# FFab5675
# FFee6a7c
# FFffa7a5
# FFffe07e
# FFffe7d6
# FF72dcbb
# FF34acba"""

# vals = """FF000000
# FF555555
# FFaaaaaa
# FFffffff
# FF0000aa
# FF5555ff
# FF00aa00
# FF55ff55
# FF00aaaa
# FF55ffff
# FFaa0000
# FFff5555
# FFaa00aa
# FFff55ff
# FFaa5500
# FFffff55"""

# vals = """FF000000
# FF800000
# FF008000
# FF808000
# FF000080
# FF800080
# FF008080
# FFc0c0c0
# FF808080
# FFff0000
# FF00ff00
# FFffff00
# FF0000ff
# FFff00ff
# FF00ffff
# FFffffff"""

# vals = """FFdc6250
# FFdeada5
# FFdad4c9
# FFffd183
# FFeeb24a
# FF55927f
# FF21525a
# FF272a32
# FF2152a5
# FF5a8bde
# FFb89ce9
# FF844790"""

vals = """FFffffff
FFffeaff
FFcc88cc
FF884488
FFeaffff
FF88cccc
FF448888
FFeaeaff
FF8888cc
FF444488
FFeaffea
FF88cc88
FF448844
FFffffea
FFcccc88
FF888844
FFffeaea
FFcc8888
FF884444
FFeaeaea
FFcccccc
FF888888
FF000000  """
ls = vals.split("\n")

print(len(vals))

for val in vals:
    r = int(val[2:4], 16)
    g = int(val[4:6], 16)
    b = int(val[6:8], 16)
    print(f"{{r: {r}, g: {g}, b: {b}}},")
#     print(f"[{r}, {g}, {b}],")
#     # print(f"({r}, {g}, {b}),")

# for i in range(32):
#     c = int((256/31)*i)
#     print(f"{{r: {c}, g: {c}, b: {c}}},")